# Profile photos

On `/user/me`, **Edit profile photo** opens a photo management dialog with a
large circular preview, **Edit**, **Upload photo**, and **Remove** actions.
Edit loads the current saved photo into the crop/filter editor; Upload opens the
same editor for a replacement. Saving here persists the photo immediately and
refreshes the current user. Removing requires confirmation and restores the
initials avatar; it does not delete the account. Failed saves keep the editor
open for retry. Previously saved crops/filters are flattened into the stored image.

During setup, the first upload opens the same crop/filter editor. **Edit photo**
then opens the photo management dialog to edit, replace, or remove that local
selection. These changes are uploaded only when the setup form is submitted.

`DELETE /users/:id/avatar` removes the owner's photo, returns the updated user,
and cleans up the previously owned file after the database update succeeds.
It requires the same session cookie and ownership checks as uploading.

Users can choose a photo during `/auth/setup` or from the profile editing dialog.
After selection, a photo editor dialog offers **Crop** and **Filter** tabs with
one shared preview. Crop provides zoom and horizontal/vertical positioning with
a round guide. Filter offers Original, Grayscale, Sepia, Warm, and Cool. Switching
tabs preserves both edits; **Save photo** creates a 512×512 PNG with the crop and
filter applied for eventual upload. **Cancel** discards both edits and keeps the
previous selection. Animated images become a still
image when cropped. Cropping runs locally without sending the original photo.
Both flows use the users feature's `AvatarPicker`, with a local preview, selection
cancel action, and client-side format/size checks. Saving sends the selected file
before updating the remaining profile fields. Selection alone does not upload it.
The returned profile updates the auth state and current-user query cache.

The cookie-authenticated endpoint is `POST /users/:id/avatar`, with multipart field
`avatar`. It returns HTTP 200 and the updated user, including a relative avatar
URL. Only the profile owner can upload. Supported types are JPEG, PNG, GIF, and
WebP, up to 5MB; the backend validates image file signatures as well as the supplied
MIME type. Original filenames are not used for storage.

Uploads remain in bounded memory until validation and ownership checks pass. Files
then persist in a private MinIO bucket (default `profile-photos`). NestJS creates
the bucket on the first upload. It streams reads through `GET /uploads/avatars/:key`,
so database URLs remain relative and stable, and the frontend needs no MinIO
credentials, public bucket policy, signed URL refresh, or storage-specific CORS.
Web uses its existing backend proxy to display and edit these images.
Successful replacements remove the previous owned object. A failed database save
removes the new object; failed storage writes leave the profile unchanged. Missing
photos return 404 and storage outages return 503. Cleanup failures are logged.

The existing `backend-uploads` volume and static route remain for photos uploaded
before this change. They are not copied to MinIO automatically; they still display
and are cleaned up when replaced or removed. All new uploads use MinIO.

Photo upload and profile-field saving are separate requests: if the second request
fails, the uploaded photo may already be saved. The form stays open for retry.
Backend replicas can share the same MinIO endpoint and bucket.

## Start MinIO and its UI

From the repository root, set the MinIO values in `.env` using
`.env.docker.example` as the template. Then:

```sh
docker compose up -d --build minio
```

Open **http://localhost:9001** and log in with `MINIO_ROOT_USER` and
`MINIO_ROOT_PASSWORD` from the root `.env`. Port **9000** is the S3 API; port
**9001** is the browser console. The bucket appears after the first photo upload.
Files persist in the `minio-data` named volume. Normal `docker compose down`
retains them. MinIO is part of the default stack and the backend waits for its
health check. To run both services and PostgreSQL:

```sh
docker compose up -d --build backend
```

For a host-run backend, set these in `backend/.env`:

```dotenv
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=<root MINIO_ROOT_USER>
MINIO_SECRET_KEY=<root MINIO_ROOT_PASSWORD>
MINIO_BUCKET=profile-photos
MINIO_REGION=us-east-1
```

Compose supplies `http://minio:9000` inside Docker. Credentials stay server-side.
Root credentials are convenient for local development; a deployed backend should
use a dedicated storage account restricted to its bucket. If the bucket is
pre-provisioned, its account needs bucket existence/read plus object put/get/delete
permissions. If not, it also needs bucket creation permission.

The [MinIO community distribution](https://github.com/minio/minio#source-only-distribution)
is source-only. `docker/minio/Dockerfile` builds official release
`RELEASE.2025-10-15T17-29-55Z`, including its embedded object-browser console.
The first build downloads Go dependencies and takes longer; subsequent builds
reuse the cache. Change the pinned release deliberately when updating.

## Verification

`npm run test:e2e` enables Node VM modules so Jest can execute Nest's ESM file-type
validator. HTTP tests use an in-memory storage adapter and SQLite, so they require
no Docker or MinIO credentials. Adapter unit tests cover bucket creation races,
outages, metadata, reads, and deletion. Frontend tests cover validation and multipart
request handling.

The separate CI object-storage job builds and starts real MinIO and checks
upload/read/delete, private bucket access, and the console HTML. To run that check
locally with Node 22 and MinIO running:

```sh
cd backend
node --env-file=.env --test --require ts-node/register test/minio.integration.cjs
```

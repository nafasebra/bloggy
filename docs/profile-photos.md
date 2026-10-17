# Profile photos

Users can choose a photo during `/auth/setup` or from the profile editing dialog.
After selection, a crop dialog provides zoom and horizontal/vertical positioning,
with a round guide. **Use photo** creates a 512×512 PNG for preview and eventual
upload; **Cancel** keeps the previous selection. Animated images become a still
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
then persist under `backend/uploads/avatars` for host development, or in the
existing `backend-uploads` Docker volume. Static assets are served at
`/uploads/avatars/...`, and Web uses its existing backend proxy to display them.
Successful replacements clean up the previous owned file. A failed database save
removes the newly written upload. The directory must be writable by the backend.

Photo upload and profile-field saving are separate requests: if the second request
fails, the uploaded photo may already be saved. The form stays open for retry.
For multiple backend replicas, replace local storage with shared/object storage
before scaling across hosts.

`npm run test:e2e` enables Node VM modules so Jest can execute Nest's ESM file-type
validator. Upload tests exercise the actual multipart endpoint and clean up their
generated files. Frontend tests cover validation and multipart request handling.

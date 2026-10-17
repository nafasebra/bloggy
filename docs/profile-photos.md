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

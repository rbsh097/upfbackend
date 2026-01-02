# Cloudinary Image Upload Implementation

## Overview
This implementation replaces local file storage with Cloudinary cloud storage for image uploads in the Upflair backend.

## Configuration

### Environment Variables (.env)
```env
CLOUDINARY_NAME=djj7il18g
CLOUDINARY_KEY=648424434211246
CLOUDINARY_SECRET=-d4FziOy4VxO0mCpaQyGmHMcbWU
```

### Files Modified

1. **config/cloudinary.js** - Centralized Cloudinary configuration
2. **middleware/cloudUpload.js** - Multer middleware with Cloudinary storage
3. **controller/blog.controller.js** - Updated to use Cloudinary URLs
4. **.env** - Added Cloudinary credentials

## How It Works

### 1. Cloudinary Configuration (config/cloudinary.js)
- Loads environment variables
- Configures Cloudinary with credentials
- Exports configured cloudinary instance for reuse

### 2. Upload Middleware (middleware/cloudUpload.js)
- Uses `multer-storage-cloudinary` to store files directly to Cloudinary
- Uploads to folder: `upflair-uploads`
- Allowed formats: jpg, jpeg, png, webp
- File size limit: 5MB
- Auto-resizes images to max 1200x1200 (maintains aspect ratio)

### 3. Blog Controller Updates
- **createBlog**: Uses `req.file.path` (Cloudinary URL) instead of local path
- **updateBlog**: Uses `req.file.path` (Cloudinary URL) instead of local path

## Benefits

✅ **No local storage needed** - Files stored in Cloudinary cloud
✅ **CDN delivery** - Fast image loading worldwide
✅ **Automatic optimization** - Images are optimized for web
✅ **Transformations** - Images auto-resized to 1200x1200
✅ **Organized storage** - All uploads in `upflair-uploads` folder
✅ **Secure URLs** - HTTPS URLs for all images

## Usage

### Creating a Blog with Image
```javascript
POST /api/blogs
Content-Type: multipart/form-data

Fields:
- title: "Blog Title"
- paragraph: "Blog content..."
- linkedinUrl: "https://linkedin.com/..."
- image: [file upload]
```

### Response
```json
{
  "_id": "...",
  "title": "Blog Title",
  "paragraph": "Blog content...",
  "linkedinUrl": "https://linkedin.com/...",
  "image": "https://res.cloudinary.com/djj7il18g/image/upload/v1234567890/upflair-uploads/abc123.jpg",
  "createdAt": "2026-01-02T12:00:00.000Z"
}
```

## Testing

1. **Start the backend server** (if not already running):
   ```bash
   cd upfbackend
   npm start
   ```

2. **Test image upload** using Postman or similar:
   - Method: POST
   - URL: http://localhost:5001/api/blogs
   - Headers: Authorization: Bearer <your-token>
   - Body: form-data with image file

3. **Verify in Cloudinary**:
   - Login to cloudinary.com
   - Check the `upflair-uploads` folder
   - Verify image is uploaded

## Cloudinary Dashboard

Access your Cloudinary dashboard at:
https://cloudinary.com/console

Cloud Name: djj7il18g

## Image Transformations

Current transformation: `{ width: 1200, height: 1200, crop: "limit" }`

You can customize transformations in `middleware/cloudUpload.js`:
- `crop: "fill"` - Crop to exact dimensions
- `crop: "fit"` - Fit within dimensions
- `crop: "limit"` - Only resize if larger (current)
- `quality: "auto"` - Auto quality optimization
- `format: "auto"` - Auto format selection

## Troubleshooting

### Error: "Only images are allowed"
- Ensure you're uploading jpg, jpeg, png, or webp files

### Error: "File too large"
- Maximum file size is 5MB
- Reduce image size before uploading

### Error: "Cloudinary credentials invalid"
- Check .env file has correct credentials
- Restart the server after changing .env

### Images not appearing
- Check the image URL in the response
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for uploaded files

## Migration Notes

### Old Implementation (Local Storage)
```javascript
image: `/uploads/${req.file.filename}`
```

### New Implementation (Cloudinary)
```javascript
image: req.file.path // Full Cloudinary URL
```

### Existing Data
If you have existing blogs with local image paths, you may need to:
1. Upload old images to Cloudinary manually
2. Update database records with new Cloudinary URLs
3. Or keep the old `upload.js` middleware for backward compatibility

## Next Steps

Consider implementing:
1. **Image deletion** - Delete from Cloudinary when blog is deleted
2. **Multiple images** - Support for image galleries
3. **Video uploads** - Extend to support video files
4. **Advanced transformations** - Face detection, auto-cropping, etc.
5. **Lazy loading** - Use Cloudinary's lazy loading features

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

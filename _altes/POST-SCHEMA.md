# fields in post object

| Field         | m/o| Values           |
| ------------- |-------------------------------------------------------------------------------------------|
| slug          | m
| alias         | o| Old wordpress Url. Not used for new posts
| publish_time  | m| JS Date object, used to order post by date. Date is displayed on the post view
| title         | m
| summary       | m|Markdown
| content       | m|Markdown
| tags          | m (might be empty)|Array of string objects
| image         | o|path of an image. if 'local' path, the image is served by the fronted Hapi
| image_positition|o | 'before_summary' (default), 'left', 'skip'
| image_expanded |o| 'true'

# image_position and image_expanded

* Both attributes are not used in PostTeaser they are only used in FullPost-View
* If `image_position` is set to `skip` the image will not be rendered at all in FullPost View (only in Teaser)
* If `image_position` is set to `left` or `right` the image will be "floating" left or right at the top of the
summary and content.
* If `image_position` is not set at all or set to `before_summary`, the image will be rendered on top of the
summary block:
* If `image_expanded` it not set at all or set to `true` the image will be shown in full width and scaled in height appropriate
to keep the aspect ratio
* If `image_expanded` is set to `false`, the image will be scaled and cropped to match a fixed height (css class ImageFullWidth, 200px)

The attribute **image_expanded** is only used at the first rendering of a Post. After rendering the Post the viewer
can switch between expanding and not expanding by clicking on the image



bla

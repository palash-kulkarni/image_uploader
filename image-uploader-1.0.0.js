var ImageUploader = function () {

  // Traverse array of FileList when Single/Multiple Images are selected or dropped in DropZone
  this.traverseImageFiles = function (files, image) {
    that = this
    var imageCategoryId = $('select.imageCategories').val();
    if(!imageCategoryId){
      return(that.clientMessage
        .display('#flash', image.failureMessage.inavlidImageCategory));
    }
    var categoryName = $('select.imageCategories').val();
    if(files.length == 1 && !that.validateFileType(files, image))
      return false;
    if(!image.categories['' + categoryName])
      _initImageCategory(that, categoryName, image);
    $.each(files, function (_, file) {
      if (image.types.test(file.type)) {
        that.displayPreview(file, categoryName, image);
        that.bindSingleDeleteEvent(categoryName, image);
      }
      else
        that.clientMessage.display('#flash', image.failureMessage.invalidFileType);
    });
  };



  this.validateFileType = function (files, image) {
    var validateFlag = true;
    that = this;
    $.each(files, function (_, file) {
      if(!image.types.test(file.type)) {
        validateFlag = false;
        that.clientMessage.display('#flash', image.failureMessage.invalidFileType);
      }
    });
    return(validateFlag);
  };



  // Binds multiple deletion of image previews after atleast one image preview is added
  this.bindDeleteAllPreviewEvent = function (image) {
    $('.preview-trash').on('click', function () {
      var category = $(this).parent().data('category');
      delete(image.categories['' + category]);
      $(this).parent().remove();
    });
  };



  // Displays preview of images dynamically on view
  this.displayPreview = function (imageFile, imageCategory, image) {
    var previewContainer = $("<div class='" + imageCategory + " uploadImgWrap' data-category='" + imageCategory + "'>" +
      "<img data-id=" + image.categories['' + imageCategory].files.length + "></img></div>");
    $(".imagePreview[data-category='" + imageCategory + "']").append(previewContainer);
    previewContainer.append("<a class='glyphicon single-preview-trash glyphicon-trash' data-id='"+ image.categories['' + imageCategory].files.length + "'></a>");
    var img = previewContainer.find('img');
    image.categories['' + imageCategory].files.push(imageFile);
    reader = new FileReader();
    reader.onload = (function (img) {
      return function (event) {
        img.attr('src', event.target.result);
      };
    })(img);
    reader.readAsDataURL(imageFile);
  };



  // Binds single image delete event after preview of image and delete icon is added
  this.bindSingleDeleteEvent = function (imageCategory, image) {
    var filesLength = image.categories['' + imageCategory].files.length - 1;
    $(".uploadImgWrap[data-category='" + imageCategory + "'] a[data-id='" + filesLength + "']").on('click', function (event) {
      $(this).parent().remove();
      delete image.categories["" + imageCategory].files[$(this).data('id')];
      delete image.categories['' + imageCategory].files[$(this).data('id')];
      if(!$(".uploadImgWrap[data-category='" + imageCategory + "']").length) {
        $(".imagePreview[data-category='" + imageCategory + "']").remove();
        delete image.categories['' + imageCategory];
      }
    });
  };



  // Private Methods
  _initImageCategory = function (context, categoryName, image) {
    image.categories['' + categoryName] = {
      files: []
    };
    $('#imagePreviewContainer')
      .append("<div class='imagePreview clearfix' data-category=" + categoryName + "></div>");
    categoryId = $('.imageCategories').val();
    $('.imagePreview[data-category=' + categoryName + ']')
      .append('<label>' + categoryName + '</label>')
      .append("<a class='glyphicon glyphicon-trash preview-trash' href='javascript:void(0);'></a>")
      .append("<div class='clearfix'></div>");
    context.bindDeleteAllPreviewEvent(image);
  };



  this.clientMessage = {
    display: function(selector, message){
      $(selector).text(message).fadeIn(0).delay(4000).fadeOut();
    }

  };

};

window.services || (window.services = {});
window.services.imageUploader = ImageUploader;

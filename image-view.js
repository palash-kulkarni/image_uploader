var ImageView = function () {
  this.image = {
    categories: {},
    types: /\/(gif|jpe?g|png)$/i,
    failureMessage: {
      invalidFileType: 'Invalid File Type',
      inavlidImageCategory: 'Please select image category'
    }
  };

  this.imageUploader = new window.services.imageUploader;

  this.init = function () {
    _imageSetting()
    _bindEvents(this.image, this.imageUploader);  
  };

  // It initialize/re-initialize an object image
  _imageSetting = function () {
    return this.image = {
      categories: {},
      types: /\/(gif|jpe?g|png)$/i,
      failureMessage: {
        invalidFileType: 'Invalid File Type',
        inavlidImageCategory: 'Please select image category'
      }
    };
  };

  // Private Methods

  // NOTE: Event delegation
  // This method binds all the events
  _bindEvents = function (image, imageUploader) {
    $('.uploadImage').on('click', function () {
      $('#uploadFile').trigger('click');
    });

    $('#dropZone').on('dragenter dragover', function (event) {
      event.stopPropagation();
      event.preventDefault();
    });

    $('#dropZone').on('drop', function (event) {
      event.preventDefault();
      event.stopPropagation();
      files = event.originalEvent.dataTransfer.files;
      imageUploader.traverseImageFiles(files, image);
    });

    $('input[type="file"]#uploadFile').on('change', function (event) {
      imageUploader.traverseImageFiles(this.files, image);
      $(this).val('')
    });
  };
};

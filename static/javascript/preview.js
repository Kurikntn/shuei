if(document.URL.match(/room/)) {
  function preview(){
    const imagePreview = document.getElementById('image-preview');
    const imageInput = document.getElementById('image-input');

    function createImageHTML(image){
      const imageElement = document.createElement('div');

      const previewImage = document.createElement('img');
      previewImage.setAttribute('src', image);
      previewImage.setAttribute('class', 'preview-image');
      previewImage.setAttribute('width', '126px');
      previewImage.setAttribute('height', '126px');
      
      imageElement.appendChild(previewImage);
      imagePreview.appendChild(imageElement);
    };

    imageInput.addEventListener('change', (e) => {
      const imageContent = document.querySelector('.preview-image');
      if (imageContent){
        imageContent.remove();
      }
      
      const file = e.target.files[0];
      const image = window.URL.createObjectURL(file);

      imagePreview.classList.add("open");

      createImageHTML(image);
    });

    document.getElementById('preview-close').addEventListener('click', () => {
      imagePreview.classList.remove("open");
      imageInput.value = "";
    });
  }
  window.addEventListener("load", preview);
}
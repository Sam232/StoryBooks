$(document).ready(() => {
  $(".button-collapse").sideNav();
  $(".row .input-field select").material_select();
  CKEDITOR.replace("body", {
    plugins: "wysiwygarea,toolbar,basicstyles,link"
  });
});
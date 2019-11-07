/* eslint-disable */

// Reply button to open comment input form
$('.newComment__button').click(() => {
  $('.showComment').toggleClass('hidden');
});
// Check if close button [X] was clicked
$('.showComment__close').click(() => {
  $('.showComment').toggleClass('hidden');
});

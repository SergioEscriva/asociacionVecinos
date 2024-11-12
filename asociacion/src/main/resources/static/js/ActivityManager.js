const deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const   
 li = button.parentNode;
    li.parentNode.removeChild(li);
  });
});
let addToy = false;

document.addEventListener("DOMContentLoaded", () => { 
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  
  getToys();
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', handleFormSubmit);


  function getToys() {
    fetch('http://localhost:3000/toys/')
    .then(res => res.json())
    .then(data => {
      data.forEach(element => {
        createCard(element);
      });
    })
    .then(() => {
      const likeButtonList = document.querySelectorAll('.like-btn');
      likeButtonList.forEach(element => {
          element.addEventListener('click', handleLikes)
      })
    })
  }


  function createCard(fetchData){
    const toyCollection = document.getElementById('toy-collection');
    const div = document.createElement('div');
    div.className = 'card';

    const name = document.createElement('h2');
    name.textContent = fetchData.name;

    const image = document.createElement('img');
    image.className = 'toy-avatar';
    image.src = fetchData.image;

    const likes = document.createElement('p');
    likes.textContent = `${fetchData.likes} Likes`;

    const btn = document.createElement('button');
    btn.className = 'like-btn';
    btn.textContent = 'Like ❤️';
    btn.id = fetchData.id;

    const cardArray = [name, image, likes, btn];
    cardArray.map(element => div.appendChild(element))
    return toyCollection.appendChild(div);
  }


  function handleLikes(e){
    const toyId = e.target.id
    let toyLikes = parseInt(e.target.previousSibling.textContent.split(" ")[0])
    fetch(`http://localhost:3000/toys/${toyId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
        body: JSON.stringify({likes: toyLikes+=1}), 
    })
    .then(res => res.json())
    .then(data => {
      e.target.previousSibling.textContent = `${data.likes} Likes`
    })
  }

  
  function handleFormSubmit(e){
    e.preventDefault();
    const toyObj = {};
    toyObj.name = e.target[0].value;
    toyObj.image = e.target[1].value;
    toyObj.likes = 0;

    fetch('http://localhost:3000/toys/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
        body: JSON.stringify(toyObj),
    }).then(() => {
      getToys()
    })
  }

});

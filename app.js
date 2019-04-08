//storage controller
const StorageCtrl = (() => {

  //public methods
  return {
    storeItem: (item) => {
      let items;

      //check if any items in local store
      if(localStorage.getItem('items') === null) {
        items = [];

        //push new item
        items.push(item);

        //set local storage
        localStorage.setItem('items', JSON.stringify(items));
      }else{

        //get what is already in local storage
        items = JSON.parse(localStorage.getItem('items'));

        //push new item
        items.push(item);

        //reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();

//item controller
const ItemCtrl = (() => {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //data structure / state
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //public methods
  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      let ID;

      //create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);
      return newItem;
    },
    getItemById: (id) => {
      let found = null;

      //loop through items
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {

      //calories to number
      calories = parseInt(calories);

      //grab item to be updates
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {

          //update item with new values
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      //return updated item
      return found;
    },
    deleteItem: (id) => {
      //get ids
      const ids = data.items.map((item) => {
        return item.id;
      });

      //get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;

      //loop through items and add calories
      data.items.forEach((item) => {
        total += item.calories;
      });

      //set total calories in data structure
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    },
    logData: () => {
      return data;
    }
  }
})();

//ui controller
const UICtrl = (() => {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    itemCard: '#item-card',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  //public methods
  return {
    populateItemList: (items) => {
      let html = '';
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li><br />`;
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: (item) => {

      //show list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      //create li element
      const li = document.createElement('li');

      //add class
      li.className = 'collection-item item-slot';

      //add id
      li.id = `item-${item.id}`;

      //add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      //insert item to ui list
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      })
    },
    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove;
      })
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

    },
    getSelectors: () => {
      return UISelectors;
    }
  }
})();

//app controller
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {

  //load event listeners
  const loadEventListeners = () => {

    //get ui selectors
    const UISelectors = UICtrl.getSelectors();

    //add item submit
    const itemAddSubmit = (e) => {

      //get form input from ui controller
      const input = UICtrl.getItemInput();

      //check for name and calorie input
      if (input.name !== '' && input.calories !== '') {

        //add item
        const newitem = ItemCtrl.addItem(input.name, input.calories);

        //add item to ui list
        UICtrl.addListItem(newItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //store in localStorage
        StorageCtrl.storeItem(newItem);

        //clear fields
        UICtrl.clearInput();
      }
      e.preventDefault();
    }

    //item edit click
    const itemEditClick = (e) => {
      if (e.target.classList.contains('edit-item')) {

        //get list item id
        const listId = e.target.parentNode.parentNode.id;

        //break into an array
        const listIdArr = listId.split('-');

        //get the actual id
        const id = parseInt(listIdArr[1]);

        //get item
        const itemToEdit = ItemCtrl.getItemById(id);

        //set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        //add item to form
        UICtrl.addItemToForm();

      }
      e.preventDefault;
    }

    const itemUpdateSubmit = (e) => {

      //get item input
      const input = UICtrl.getItemInput();

      //update item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      //update ui
      UICtrl.updateListItem(updatedItem);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //update local storage
      StorageCtrl.updateItemStorage(updatedItem);
      

      UICtrl.clearEditState();

      e.preventDefault();
    }

    //delete button event
    const itemDeleteSubmit = (e) => {

      //get current item
      const currentItem = ItemCtrl.getCurrentItem();

      //delete from data structure
      ItemCtrl.deleteItem(currentItem.id);

      //detete from ui
      UICtrl.deleteListItem(currentItem.id);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //delete from local storage
      StorageCtrl.deleteItemFromStorage(currentItem.id);

      UICtrl.clearEditState();
      e.preventDefault();
    }
    //clear items event
    const clearAllItemsClick = () => {
      //delete all items from data structure
      ItemCtrl.clearAllItems();

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //remove from ui
      UICtrl.removeItems();

      //clear from local storage
      StorageCtrl.clearItemsFromStorage();

      //hide ul
      UICtrl.hideList();
    };

    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //disable submit on enter
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    //edit icon click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  //public methods
  return {
    init: () => {

      //clear edit state
      UICtrl.clearEditState();

      //fetch items from data structure
      const items = ItemCtrl.getItems();

      //check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {

        //populate list with items
        UICtrl.populateItemList(items);
      }

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //load event listeners
      loadEventListeners();

    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);


//initialze app
App.init();
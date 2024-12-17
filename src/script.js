const theme = document.querySelector("#theme");
const addItemInput = document.querySelector("#add-item");
const todoItems = document.querySelector(".todo-items");
const todoItem = document.querySelector(".todo-item");
const filterButtons = document.querySelectorAll(".filters .filter");
const itemsLeftDisplay = document.querySelector(".todo-btns span");
const todoText = document.querySelector(".to-do-text");
const themeLabel = document.querySelector('label[for="theme"]');
const checkboxes = document.querySelectorAll(
  '.todo-item input[type="checkbox"]'
);
const allBtn = document.querySelector("#All");
const activeBtn = document.querySelector("#Active");
const completedBtn = document.querySelector("#Completed");
const clearCompletedBtn = document.querySelector("#clear-completed");

// Theme toggle
theme.addEventListener("click", () => {
  document.querySelector("body").classList = [
    theme.checked ? "theme-light" : "theme-dark",
  ];
});

// add new todo
addItemInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && addItemInput.value.trim() !== "") {
    e.preventDefault();
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    todoItem.setAttribute("draggable", true);
    todoItem.innerHTML = `
                <label class="list-item">
                  <input type="checkbox"  />
                  <span class="custom-checkmark">
                  </span>
                  <div class="to-do-text">${addItemInput.value}</div>
                </label>
                <span class="delete-btn">
                  <img src="./assets/images/icon-cross.svg" alt="delete-btn" />
                </span>
    `;
    todoItems.append(todoItem);
    addItemInput.value = "";
    updateItemsLeft(1);
  }
});

// Function to update the count of unchecked items
function updateItemsLeft() {
  const uncheckedCount = [...checkboxes].filter(
    (checkbox) => !checkbox.checked
  ).length;
  itemsLeftDisplay.textContent = `${uncheckedCount} items left`;
}
// Add event listeners to all checkboxes
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateItemsLeft);
});

// Delete item when clicking the delete
document.addEventListener("DOMContentLoaded", () => {
  // Select all delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  // Add event listeners to delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const todoItem = e.target.closest(".todo-item"); // Find the closest parent to-do item
      if (todoItem) {
        todoItem.remove(); // Remove the item from the DOM
        updateItemsLeft(); // Update the count of remaining items
      }
    });
  });

  // Update the "items left" count
  const updateItemsLeft = () => {
    const itemsLeft = document.querySelectorAll(
      '.todo-item input[type="checkbox"]:not(:checked)'
    ).length;
    document.querySelector(
      ".todo-btns span"
    ).textContent = `${itemsLeft} items left`;
  };
  updateItemsLeft(); // Initial count update
});

// drag and drop //
let draggedItem = null;

// Add event listeners for drag start
todoItems.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("todo-item")) {
    draggedItem = e.target; // Store the dragged item
    e.target.classList.add("dragging");
  }
});

todoItems.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("todo-item")) {
    e.target.classList.remove("dragging");
    draggedItem = null; // Reset dragged item
  }
});

// Drag over logic to place the item
todoItems.addEventListener("dragover", (e) => {
  e.preventDefault(); // Allow dropping
  const afterElement = getDragAfterElement(todoItems, e.clientY);
  const draggingItem = document.querySelector(".dragging");

  if (afterElement == null) {
    todoItems.appendChild(draggingItem);
  } else {
    todoItems.insertBefore(draggingItem, afterElement);
  }
});

// Helper function to get the position after which to insert
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}


// filter
//All:show all items
allBtn.addEventListener("click",()=>{
  document.querySelectorAll(".todo-item").forEach((item)=>{
item.style.display = "flex"
  })
})
// Active: Show only unchecked items.

activeBtn.addEventListener("click", () => {
  document.querySelectorAll(".todo-item").forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      item.style.display = "none"; // Hide completed items
    } else {
      item.style.display = "flex"; // Show active (unchecked) items
    }
  });
});
// Completed: Show only checked items.


completedBtn.addEventListener("click", () => {
  document.querySelectorAll(".todo-item").forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      item.style.display = "flex"; // Show completed items
    } else {
      item.style.display = "none"; // Hide unchecked items
    }
  });
});
// Clear Completed: Remove all completed (checked)

clearCompletedBtn.addEventListener("click", () => {
  document.querySelectorAll('.todo-item input[type="checkbox"]:checked').forEach((checkbox) => {
    checkbox.closest(".todo-item").remove(); // Remove the checked item
  });
  updateItemsLeft(); // Update the count after clearing
});

// Select elements

updateItemsLeft();




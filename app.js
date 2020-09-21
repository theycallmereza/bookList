class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert Cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(row)
    }

    showAlert(msg, className) {
        // create div
        const div = document.createElement('div');
        // add classes
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(msg));

        // Get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === "delete") {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        let books = Store.getBooks();

        books.forEach(function (book) {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        let books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        let books = Store.getBooks();
        books.forEach(function (book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks)


// Event listener
document.getElementById('book-form').addEventListener('submit',
    function (e) {
        // Get form values
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value;

        // Instantiate book
        const book = new Book(title, author, isbn);

        // Instantiate UI
        const ui = new UI();

        // Validate
        if (title === '' || author === '' || isbn === '') {
            // Error Alert
            ui.showAlert("Please fill in all fields!", "error")
        } else {
            // Add book to list
            ui.addBookToList(book);
            ui.showAlert("Book Added", "success");
            // add to local storage
            Store.addBook(book);
            // Clear Fields
            ui.clearFields();
        }

        e.preventDefault()
    });

// Event listener for delete
document.getElementById('book-list').addEventListener('click',
    function (e) {
        // Instantiate UI
        const ui = new UI();

        ui.deleteBook(e.target);
        // remove from local storage
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        ui.showAlert('Book Removed!', 'success');


        e.preventDefault()
    });

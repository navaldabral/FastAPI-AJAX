// Fetch data from api and set value in pagination pattern

let sortBy = "id";
let sortDirection = "desc"; 
let currentPage = 1;
const perPage = 5;

function fetchContacts(page = 1) {
    currentPage = page;
    $.ajax({
        url: `http://127.0.0.1:8000/get_all_users?page=${currentPage}&per_page=${perPage}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
        method: 'GET',
        success: function(response) {
            let tableContent = '';
            response.users.forEach(contact => {
                tableContent += `
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>
                            <button type="button" class="btn btn-danger mr-1" onclick="deleteUser(${contact.id})">Delete Contact</button>
                            <button type="button" class="btn btn-warning" onclick="updateUser(${contact.id})">Update Contact</button>
                        </td>
                    </tr>
                `;
            });
            $('#contactsTable').html(tableContent);
            totalPages = response.total_pages;
            currentPage = response.current_page;
            updatePaginationControls();
        }
    });
}

function sortContacts(field) {
    if (sortBy === field) {
        sortDirection = (sortDirection === "asc") ? "desc" : "asc";
    } else {
        sortBy = field;
        sortDirection = "asc";
    }
    fetchContacts(currentPage);
}


$(document).ready(function() {
    $('#sortName').on('click', function() {
        sortContacts('name');
    });
    $('#sortEmail').on('click', function() {
        sortContacts('email');
    });
    $('#sortPhone').on('click', function() {
        sortContacts('phone');
    });
    fetchContacts();
});

// this function is use for submit the form data to api
$('#contactForm').on('submit', function(event) {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const name = $('#name').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const userid = $('#userid').val();
    if (name == '' || email == '' || phone == '') {
        alert('Please fill out all fields.');
        return false
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email.');
        return false
    }
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number (10 digits).');
        return false
    }
    if(userid == ''){
        const formData = {
            name: name,
            email: email,
            phone: phone
        };
        $.ajax({
            url: 'http://127.0.0.1:8000/add_user',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#contactForm')[0].reset();
                fetchContacts();  
                showSuccessMessage('User added successfully!');
                
            }
        });
    }else{
        const formData = {
            name: name,
            email: email,
            phone: phone,
            userid: userid
        };
        $.ajax({
            url: `http://127.0.0.1:8000/update_user/${userid}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                fetchContacts(currentPage);  
                showSuccessMessage('User Updated successfully!');
                $('#contactForm')[0].reset();
            }
        });
    }
});





function updatePaginationControls() {
    let paginationControls = '';
    for (let page = 1; page <= totalPages; page++) {
        if (page === currentPage) {
            paginationControls += `<button class="btn btn-primary active">${page}</button> `;
        } else {
            paginationControls += `<button class="btn btn-light" onclick="fetchContacts(${page})">${page}</button> `;
        }
    }
    $('#paginationControls').html(paginationControls);
}

// this is user for load data when page load
$(document).ready(function() {
    fetchContacts();
});

// fetchContacts();

$('#search').on('input', function() {
    const searchText = $(this).val().toLowerCase();
    $('tbody tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1)
    });
});

// this is use for delete the data
function deleteUser(userId) {
    $.ajax({
        type: "DELETE",
        url: `http://127.0.0.1:8000/delete_user/${userId}`,
        success: function(response) {
            if (response.status === "success") {
                fetchContacts(currentPage);
                showSuccessMessage('User Deleted successfully!');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            alert("An error occurred while deleting the user.");
        }
    });
}

// this function is use for to update the data
function updateUser(userid) {
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:8000/get_user/${userid}`, 
        success: function(response) {
            if (response.status === "success") {
                $("#name").val(response.data.name);
                $("#email").val(response.data.email);
                $("#phone").val(response.data.phone);
                // $("#userid").data("userid", userId);
                document.getElementById('userid').value = userid;
                
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching user details:", error);
        }
    });
}


function showSuccessMessage(message) {
    $('#successMessage').html(message).fadeIn();
    setTimeout(function() {
        $('#successMessage').fadeOut();
    }, 3000);
}


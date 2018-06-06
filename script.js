var _db = firebase.database();

function addTodo() {
  var form = new FormData(document.querySelector('form'));
  var newTodoRef = _db.ref('todos').push();
  newTodoRef.set({
    title: form.get('title'),
    description: form.get('description'),
    date: (new Date()).toDateString()
  });
  document.querySelector('form').reset();
  return false;
}

fetchTodos();

function fetchTodos() {
    var table = document.querySelector('tbody');
    _db.ref('todos').on('child_added', data => {
        // console.log(data.val());
        var row = generateRow(data.val(), data.key);
        var tr = document.createElement('tr');
        table.innerHTML += row;
    });
}

function deleteRow(key, row) {
    $(`#${key}`).remove();
    _db.ref('todos/' + key).set({});
}


function generateRow(data, key) {
    return `
    <tr id="${key}">
        <td id="title">${data.title}</td>
        <td id="desc">${data.description}</td>
        <td id="date">${data.date}</td>
        <td>
            <button class='btn btn-warning' onclick="editRow('${key}')">Edit</button>
            <button class='btn btn-danger' onclick="deleteRow('${key}')">Del</button></td>
    </tr>`
}

function editRow(key) {
    var tempTitle = $(`#${key} td#title`).html();
    var tempDesc = $(`#${key} td#desc`).html();
    // console.log(tempTitle, tempDesc)
    $('#editBox').modal('show');
    $('#temp-title').val(tempTitle);
    $('#temp-key').val(key);
    $('#temp-desc').html(tempDesc);
    // _db.ref('todos/' + key).set({});
}

function saveTodo() {
    var tempTitle = $('#temp-title').val();
    var key = $('#temp-key').val();
    var tempDesc = $('#temp-desc').val();
    _db.ref('todos/' + key).update({
        title: tempTitle,
        description: tempDesc,
        date: (new Date()).toDateString()
    })
    $('#title').html(tempTitle);
    $('#desc').html(tempDesc);
    $('#date').html((new Date()).toDateString());
}
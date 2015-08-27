function getJSON(url, callback) {
  request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400){
      // Success!
      data = JSON.parse(this.response);
      callback(data);
    } else {
      // We reached our target server, but it returned an error
    }
  };


function expTable(data) {
    var body = '';
    body += '<table class="table"><tbody>';
    for (var key in data) {
      var amount = data[key];
      body += '<tr>';
      body += '<td>'+ amount +'</td>';
      body += '<td><a href="#" data-toggle="modal" data-target="#catDetailModal" data-cat="'+key+'">'+ key +'</a></td>';
      body += '</tr>';
    }
    body += '</tbody></table>';

    return body;
}

function expDetailTable(key, data) {
    if (!key || !data) return '';

    var body = '';
    body += '<table class="table">';
    body += '<thead><tr>';
    body += '<th>Amount</th><th>Description</th>';
    body += '</tr></thead><tbody>';

    for (var i=0; i<data.length; i++) {
      var amount = data[i][0];
      var desc   = data[i][1];
      body += '<tr>';
      body += '<td>'+ amount +'</td>';
      body += '<td>'+ desc +'</td>';
      body += '</tr>';
    }
    body += '</tbody></table>';

    return body;
}

function showTxData(expenses) {
    var body = expTable(expenses);
    $("#txSummary").html(body);
    $("#results").show();
}

function updateCatModal(modal, key, budget) {
	var content = expDetailTable(key, budget.expenseDetails[key]);

    var total = budget.expenses[key];
    if (!total || total == 0) total = '';

    modal.find('.modal-title').text(key);
    modal.find('#catDetailTotalLabel').text(total);
    modal.find('.modal-body').html(content);
}

function processTx(budget) {
  var data = $("#tx_text").val();
  var matches_url = $("#matches_url").val();
  
  

  getJSON(matches_url, function( matches ) {
    budget.loadMatches(matches);
    budget.parseData(data);
    showTxData(budget.expenses);
  })
}



$( document ).ready(function() {
    var budget = new budgeting();

    $("#tx_input").show();
    $("#showInputTxBtn").hide();
    $("#results").hide();

    $("#showInputTxBtn").click( function() {
       $("#tx_input").show();
       $("#showInputTxBtn").hide();
    });
    $("#loadTxBtn").click( function() {
      $("#tx_input").hide();
      $("#results").hide();
      $("#showInputTxBtn").show();
      processTx(budget);
    });
    $("#version").html("v"+budget.version);
    $('#catDetailModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var key = button.data('cat');
      var modal = $(this);
	     updateCatModal(modal, key, budget);
    })
    console.log("v"+budget.version);
});

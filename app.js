function getYAML(url, callback) {
  $.ajax({
    url: url,
    contents: {
      yaml: /yaml/
    },
    converters: {
      "text yaml": function(value){
        return jsyaml.safeLoad(value);
      },
      "* text": function(value){
        return jsyaml.safeLoad(value);
      },
      "yaml json": function(value){
        return jsyaml.safeLoad(value);
      },
    }
  }).done(function(data) {
    callback(data);
  });
}

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
    body += '<th>Date</th><th>Amount</th><th>Description</th>';
    body += '</tr></thead><tbody>';

    for (var i=0; i<data.length; i++) {
      body += '<tr>';
      body += '<td>'+ data[i].date +'</td>';
      body += '<td>'+ data[i].amount +'</td>';
      body += '<td>';
      if (data[i].title) body += data[i].title +'<br />';
      body += '<i><small>'+ data[i].desc +'</small></i>';
      body += '</td>';
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



  getYAML(matches_url, function( matches ) {
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

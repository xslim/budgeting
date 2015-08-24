var version = "0.1.9";
var expenses = {};
var matches_reg = {};
var expenses_detail = {};

function fill_expense(key, amount, desc) {
  amount = Math.abs(amount);
  var total = +(expenses[key] + amount).toFixed(2);
  expenses[key] = total;
    
  if (!expenses_detail[key]) expenses_detail[key] = [];
  expenses_detail[key].push([amount,  desc]);
}

function parse_data_line(line) {
  if (!line || line.length < 7) {
    //console.log('Strange line: ', line);
    return;
  }
    
  var amount = line[6];
  var desc   = line[7];

  amount = amount.replace(',', '.');
  amount = parseFloat(amount);

  // incoming
  if (amount > 0) {
    fill_expense('incoming', amount, desc);
    return;
  }

  for (var key in matches_reg) {
    var match = desc.match(matches_reg[key]);
    if (match != null) {
      fill_expense(key, amount, match[0]);
      return;
    }
  }

  // unmatched
  fill_expense('unknown', amount, desc);
}

function parseData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var lines = [];

  for (var i=0; i<allTextLines.length; i++) {
    var data = allTextLines[i].split("\t");
    parse_data_line(data);
  }
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

function showTxData(expenses, expenses_detail) {
    var body = '';
    
    body = expTable(expenses);
    $("#txSummary").html(body);
    $("#results").show();
}

function updateCatModal(modal, key) {
	var content = expDetailTable(key, expenses_detail[key]);
        
    var total = expenses[key];
    if (!total || total == 0) total = '';
    
    modal.find('.modal-title').text(key);
    modal.find('#catDetailTotalLabel').text(total);
    modal.find('.modal-body').html(content);
}

function processTx() {
    
    var matches_url = $("#matches_url").val();
    $.getJSON(matches_url, function( matches ) {
        for (var key in matches) {
  			expenses[key] = 0;
  			if (matches[key].length > 0) {
                matches_reg[key] = new RegExp(matches[key].join("|"), "i");
            }
		}
        
        var data = $("#tx_text").val();
    	parseData(data);
        showTxData(expenses, expenses_detail);
        //console.log(expenses);
        
    })
}

$( document ).ready(function() {
    $("#tx_input").show();
    $("#showInputTxBtn").hide();
    $("#results").hide();
    
    $("#showInputTxBtn").click( function() {
       $("#tx_input").show();
       $("#showInputTxBtn").hide();
    });
    $("#loadTxBtn").click( function() {
      $("#tx_input").hide();
      $("#showInputTxBtn").show();
      processTx();
    });
    $("#version").html("v"+version);
    $('#catDetailModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var key = button.data('cat');
      var modal = $(this);
	  updateCatModal(modal, key);
    })
    console.log("v"+version);
});



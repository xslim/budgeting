(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('budgeting', function() {

    function Budgeting(matches, data) {
      this.version = "0.2.0";
      this.resetExpenses();

      if (matches) this.loadMatches(matches);
      if (data) this.parseData(data);
    }

    Budgeting.prototype.resetExpenses = function () {
      this.expenses = {};
      this.expenseDetails = {};
    };

    Budgeting.prototype.loadMatches = function (matches) {
      this.matches_reg = {};

      for (var key in matches) {
        this.expenses[key] = 0;
        this.expenseDetails[key] = [];
        if (matches[key].length > 0) {
          this.matches_reg[key] = new RegExp(matches[key].join("|"), "i");
        }
      }
    };

    Budgeting.prototype.fill_expense = function (key, amount, date, title, desc) {
      amount = Math.abs(amount);
      var total = +(this.expenses[key] + amount).toFixed(2);
      this.expenses[key] = total;
      this.expenseDetails[key].push({
        date: date,
        amount: amount,
        title: title,
        desc: desc
      });
    };

    Budgeting.prototype.parse_data_line = function (line) {
      if (!line || line.length < 7) {
        //console.log('Strange line: ', line);
        return;
      }

      var date = line[2];
      var amount = line[6];
      var desc   = line[7];

      amount = amount.replace(',', '.');
      amount = parseFloat(amount);

      // incoming
      if (amount > 0) {
        this.fill_expense('incoming', amount, date, null, desc);
        return;
      }

      for (var key in this.matches_reg) {
        var match = desc.match(this.matches_reg[key]);
        if (match != null) {
          this.fill_expense(key, amount, date, match[0], desc);
          return;
        }
      }

      // unmatched
      this.fill_expense('unknown', amount, date, null, desc);
    }

    Budgeting.prototype.parseData = function (text, delimiter) {
      if (!text) {
        return;
      }

      if (typeof Buffer === 'function' && text instanceof Buffer) {
        text = text.toString();
      }

      if (!delimiter) delimiter = "\t";

      var lines = text.split(/\r\n|\n/);

      for (var i=0; i<lines.length; i++) {
        var data = lines[i].split(delimiter);
        this.parse_data_line(data);
      }
    }

    return Budgeting;
}));

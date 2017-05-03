var calendar = new Vue({

    el: "#calendar",

    created: function() {

        this.calcScrollBarWidth();

        this.getDisplayData();
        
        this.hour12 = this.get12HourClock();
        this.today = this.display.data;

        this.markCurrTime();
        
        document.querySelector("#calendar").style.display = "block";

    },

    data: {

        today: {},

        display: {},

        hour12: [],

        displayMode: getCookie("displayMode") || "Month",

    },

    watch: {

        displayMode: function(mode) {

            this.markCurrTime();

            setCookie("displayMode", mode);

        }

    },

    computed: {

        dateString: function() {

            var mode = this.displayMode,
                date = this.display.data.val;

            if (mode === "Month") {

                return date.format("y年m月");

            }
            else if (mode === "Week") {

                var first = this.display.week[0],
                    last = this.display.week.slice(-1)[0],
                    format = this.display.data.month === last.getMonth() ? "d日" : "m月d日";

                return first.format("y年m月d日") + ' － ' + last.format(format);

            }
            else if (mode === "Date") {
                return date.format("y年m月d日 (週D)");
            }

        },

        todayBtnOn: function() {

            var mode = this.displayMode,
                compare = this.compare(this.display.data.val);

            return "" ||
                (compare.sameMonth && compare.sameYear && mode === "Month") ||
                (compare.sameWeek && mode === "Week") ||
                (compare.today && mode === "Date");

        }


    },

    methods: {

        getDisplayData: function(dateObj) {

            var temp = dateObj || new Date(),
                cDate = temp.getDate(), // current date
                one = temp.addDays(-1 * cDate + 1), //first day of current month
                index = one.getDay() - 1,
                MonthDayCount = one.getMonthDayCount(),
                days = [],
                thisMonth = [],
                lastMonth = [],
                nextMonth = [];

            for (var a = 0; a < MonthDayCount; a++) {
                thisMonth.push(one.addDays(a));
            }

            for (var b = 0; b < index; b++) {
                lastMonth.push(one.addDays((b + 1) * -1));
            }

            days = lastMonth.reverse().concat(thisMonth);

            var length = days.length,
                max = 35;

            if (length > 35) {
                max = 42;
            }

            for (var c = length; c < max; c++) {
                nextMonth.push(thisMonth[thisMonth.length - 1].addDays(c - length + 1));
            }

            days = days.concat(nextMonth);

            var cIndex = lastMonth.length + cDate - 1,
                wIndex = cIndex - temp.getDay() + 1; // index of this week first day in days 

            this.display = {

                days: days,
                week: days.slice(wIndex, wIndex + 7),
                data: {
                    val: temp,
                    index: cIndex,
                    date: cDate,
                    month: temp.getMonth(),
                    hour: temp.getHours()
                }

            };

        },

        compare: function(dateObj) {

            var date = dateObj.getDate(),
                month = dateObj.getMonth(),
                year = dateObj.getFullYear(),
                sYear = this.today.val.getFullYear() === year,
                sMonth = this.today.month === month && sYear,
                sWeek = this.week(this.today.index) === this.week(this.display.data.index) && sMonth,
                sDate = this.today.date === date && sMonth,
                cMonth = this.display.data.month,
                lastMonth = cMonth === 1 ? month === 12 : month < cMonth,
                nextMonth = cMonth === 12 ? month === 1 : month > cMonth;

            return {

                sameYear: sYear,
                sameDate: sDate,
                sameWeek: sWeek,
                sameMonth: sMonth,
                lastMonth: lastMonth,
                nextMonth: nextMonth,
                today: sDate,

            };

        },

        getClassName: function(obj) {

            var classNames = "",
                compare = this.compare(obj);

            for (var key in compare) {

                if (compare[key]) {
                    classNames += ' ' + key;
                }

            }

            return classNames.trim();

        },

        change: function(n) {

            var mode = this.displayMode;

            if (mode === "Month") {
                this.getDisplayData(this.display.data.val.addMonths(n));
            }
            else if (mode === "Week") {

                var result = this.display.week[0].addDays(n * 7);
                if (result.getDate() === this.display.data.val.getMonthDayCount()) {
                    result = result.addDays(1);
                }

                this.getDisplayData(result);

            }
            else if (mode === "Date") {
                this.getDisplayData(this.display.data.val.addDays(n));
            }

            
        },

        markCurrTime: function() {

            var minutes = this.today.val.getMinutes(),
                mode = this.displayMode;

            if (mode === "Month") {
                return;
            }

            Vue.nextTick(function() {

                var parent = document.querySelector(".tableContent > ." + mode.toLowerCase() + " .overflowScroll"),
                    elem = parent.querySelector(".timeRow.currHour"),
                    redLine = parent.querySelector(".redLine");

                parent.scrollTop = elem.offsetTop - parent.clientHeight * 0.5;
                redLine.style.top = elem.offsetTop + minutes / 60 * parent.querySelector(".timeRow").offsetHeight - 1 + "px";
                redLine.style.display = "block";

            });

        },

        week: function(index) {
            // index of week
            return Math.ceil((index + 1) / 7);
        },

        get12HourClock: function() {

            var arr = ["上午12點"];

            for (var i = 1; i < 24; i++) {
                arr.push(i <= 12 ? "上午" + i + "點" : "下午" + (i - 12) + "點");
            }

            return arr;

        },

        calcScrollBarWidth: function() {

            var padding = getScrollBarWidth() + 8 + "px";

            document.querySelector(".tableHeader > .week").style.paddingRight = padding;

            [].forEach.call(document.querySelectorAll(".overflowScroll > .borderTop, .overflowScroll > .borderBottom"), function(elem) {
                elem.style.width = "calc( 100% - " + padding + ")";
            });

        }

    }

});

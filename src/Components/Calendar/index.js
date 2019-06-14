import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        today: moment(),
        showMonth: false,
        showYear: false,
    }

    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort();
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    }

    month = () => {
        return this.state.dateContext.format("MMMM");
    }

    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    
    currentDate = () => {       
        return this.state.dateContext.get("date");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        })
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
    }
    
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <a href="#" onClick={(e) => { this.onSelectChange(e, data) }}>
                        {data}
                    </a>
                </div>
            )
        });
        return (
            <div className="month-popup">
                {popup}
            </div>
        )
    }
    
    onChangeMonth = () => {
        this.setState({
            showMonth: !this.state.showMonth
        })
    }
    MonthNav = () => {
        return (
            <div 
                onClick={(e) => { this.onChangeMonth(e, this.month()) }}>
                {this.month()}
                {this.state.showMonth &&
                    <this.SelectList data={this.months} />
                }
            </div>
        )
    }

    showYear = () => {
        this.setState({
            showYear: true
        })
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }

    onChangeYear = (e) => {
        this.setYear(e.target.value);
        this.props.onChangeYear && this.props.onChangeYear(e, e.target.value);
    }


    YearNav = () => {
        return (
            this.state.showYear ?
                <input
                    defaultValue={this.year()}
                    ref={(yearInput) => this.yearInput = yearInput}
                    onKeyUp={(e) => this.onKeyUpYear(e)}
                    onChange={(e) => this.onChangeYear(e)}
                    type="number"
                    placeholder="year"
                />
                :
                <span
                    onClick={(e) => { this.showYear(e, this.year()) }}>
                    {this.year()}
                </span>
        )
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    onDayClick = (e, day) => {
        this.props.onDayClick && this.props.onDayClick(e, day);
    }

    render() {

        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} >{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 100} >
                {""}
            </td>
            );
        }

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d === this.currentDate() ? "day current-day" : "day");          
            daysInMonth.push(
                <td key={d} className={className} >
                    <span onClick={(e) => { this.onDayClick(e, d) }}>{d}</span>
                </td>
            );

        }

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i * 80}>
                    {d}
                </tr>
            );
        });
        let FontAwesome = require('react-fontawesome');

        return (
            <div className="calendar-container" >
                <table className="calendar">
                    <thead>
                        <tr className="calendar-header">
                            <td colSpan="1">
                                <FontAwesome
                                    className='left'
                                    name='fa fa-chevron-left'
                                    style={{ color: 'white' }}
                                    onClick={(e) => { this.prevMonth() }}
                                />
                            </td>
                            <td colSpan="5">
                                <this.MonthNav></this.MonthNav>
                                {" "}
                                <this.YearNav></this.YearNav>
                            </td>
                            <td colSpan="1">
                                <FontAwesome
                                    className='right'
                                    name='fa fa-chevron-right'
                                    style={{ color: 'white' }}
                                    onClick={(e) => { this.nextMonth() }}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody >
                        <tr>
                            {weekdays}
                        </tr>
                        {trElems}
                    </tbody>
                </table>

            </div>

        );
    }
}
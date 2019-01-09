const schedule = require('node-schedule');
const notifier = require('node-notifier');

const schedules = () => {
    console.log('Scheduler reporting for duty.')
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 5)];
    rule.hour = 14;
    rule.minute = 38;

    schedule.scheduleJob(rule, function(){
        console.log('US market opened.');
        notifier.notify({
            title: 'Market Open',
            message: 'US Market has opened.'
        });
    });

    // Run these tasks at midnight every single day
    schedule.scheduleJob('0 0 * * *', function(){
        updateSymbols();
    });
};

module.exports.schedules = schedules;
function getData(val) {
    return val;
}

function setData(val,newVal) {
    if (val === newVal) {
        return;
    }
    console.log('recived:'+val);
    // notify
}


setData( name , "Hello!");
var name = "Hello!"


var ele;

setTimeout(function () {
setData(    name,'I need a good job');
    name='I need a good job';

}, 1000);

setTimeout(function () {
   console.log(name)
}, 3000);
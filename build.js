let fs = require("fs");

function run(path, name) {
    var data = fs.readFileSync(path + name).toString();
    var dafault = fs.readFileSync(path + 'fram.js').toString();
   
    // setData( selfVue.data.name,'I need a good job');
    // selfVue.data.name='I need a good job'
    while (true) {
        var patt1 = /(;*)(\s*)[a-zA-z0-9]+(\s*)=/;
        var names=patt1.exec(data);
        if (!names) {
            break;
        }
        var name = names[0].replace('\n','');
        var patt2 = new RegExp('((var)|()|(let))(\s*)'+ name + '(.*)(\s*)(;*)');
        var s = patt2.exec(data)[0];
        var index = data.indexOf(s);
        var patt3 = new RegExp(name + '(.*)(\s*)(;*)');
        var sn=patt3.exec(data)[0];
        // Don't  test it , if the string contant "var","let" and ";" .
        dafault = dafault + '\n' + data.substring(0, index)
        + 'setData(' + name.replace('=', '').replace('var').replace('let')  
        + ',' + sn.replace(name, '').replace(';','')+');\n' 
        + data.substring(index,index+s.length+1);
        data = data.substring(index+s.length, data.length );

    }
    dafault = dafault+data;
    fs.writeFileSync(path + 'dist.js', dafault, {
        flag: "w"
    });
}
// 如果不输入文件名,则遍历输入目录的所有文件(待开发)
run("./", 'index.js');
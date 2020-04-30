function defineReactive(data, key, val) {
    observe(val); // 递归遍历所有子属性
    var dep = new Dep(); 
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            if (Dep.target) {  // 判断是否需要添加订阅者
                dep.addSub(Dep.target); // 在这里添加一个订阅者
            }
            return val;
        },
        set: function(newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            dep.notify(); // 如果数据变化，通知所有订阅者
        }
    });
}
 
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};
 

function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        console.log('notify');
        console.log(this.subs);
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
/*
vm，就是之后要写的SelfValue对象，相当于Vue中的new Vue的一个对象。
exp是node节点的v-model或v-on：click等指令的属性值。
如v-model="name"，exp就是"name"。
cb，就是Watcher绑定的更新函数。
*/
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();  // 将自己添加到订阅器的操作
}
 
Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        console.log('------------------');
        console.log(this.exp);
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        console.log(value);
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this;  // 缓存自己
        // 这里获取vm.data[this.exp] 时，会调用Observer中Object.defineProperty中的get函数
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己
        return value;
    }
};

function SelfVue (data, el, exp) {
    var self = this;
    this.data = data;
 
    Object.keys(data).forEach(function(key) {
        self.proxyKeys(key);  // 绑定代理属性
    });
 
    observe(data);
    el=this.data[exp];
    console.log(this.data)
    // el.innerHTML = this.data[exp];  // 初始化模板数据的值
    new Watcher(this, exp, function (value) {
        console.log(value)
        // el.innerHTML = value;
    });
    return this;
}
SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}


var name="Hello!"
var ele;
var selfVue = new SelfVue({
    name
}, ele, 'name');
setTimeout(function () {
    console.log('-----------------')
    console.log(selfVue.data)
    console.log(selfVue.data.jobs)
    selfVue.name = 'I need a good job';
}, 2000);
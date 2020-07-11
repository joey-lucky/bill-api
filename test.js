function Test() {
    this.abc = function a() {

    }
}

console.log(new Test().abc.name);
import {INestApplication} from '@nestjs/common';

let dataKey:any = {};

function param(p:string) {
  return (target, key, index)=>{
    Object.defineProperties(target,key,)
  }
}
class Controller{
  constructor() {
  }

  render(@param("a") p1,@param("c") p2){
    console.log(p1,p2);
  }
}

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    let controller = new Controller();
    let jsonData = {a: "测试a",c:"测试c"}
    let name = Controller.name;
    let keys = dataKey[name].render || [];
    let params = keys.map(key => jsonData[key]);
    // @ts-ignore
    controller.render(...params);
  });
});

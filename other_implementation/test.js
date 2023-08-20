// testing the module
import CheckObstruction  from './check_route.js'
const routeOne = new CheckObstruction([130.3, 133.4], [100, 120], 50);
console.log(routeOne.checkRoute());
console.log("-----------------------");
const routeTwo = new CheckObstruction([53.5872, 2.4138], [53.5872, 2.4138], 15);
console.log(routeTwo.checkRoute());
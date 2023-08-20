// implementing the first task (OOP Concept)
/* 
     This module  helps explorers in calculating the best way to avoid
     hitting impenetrable rocks under the earth while digging to the core of the earth.

    It contains a single class checkObstruction
*/
import TimeDuration from './TimeDuration.js'

// creating the checkObstruction class
class CheckObstruction {
    /*
        calculates the time expected for a machine to dig the earth crust
        to check whether there is obstruction or not

         Params: 
            point_a(array): the first point co-ordinates
            point_b(array): the second point co-ordinates
            speed(int): the speed of the machine
        Returns: true or false
    */ 
    constructor (pointA = [0, 0], pointB = [0, 0], speed = 0) {
        this.pointA = pointA,
        this.pointB = pointB,
        this.speed = speed;
    }


    distance () {
        /*
            calculates the distance between the two points
            returns the distamce in miles
        */ 
    // the distance btw. two points is given by d = sqrt((x1 - x2) + (y1 - y2))
    // where x and y are the horizontal and vertical cordinates of the points
        const x1 = this.pointA[0];
        const x2 = this.pointB[0];
        const y1 = this.pointA[1];
        const y2 = this.pointB[1];
        return Math.sqrt(((x1 - x2) + (y1 + y2)));
    };

    checkRoute () {
        // performs the calculation to check for obstruction
        // returns true or not
        const timeFromAtoB = new TimeDuration(this.pointA, this.pointB).duration();
        const expectedTime = this.speed * this.distance()
        console.log("expectedTime: ", expectedTime, "time_duration: ", timeFromAtoB);
        if (timeFromAtoB - expectedTime >= 60) {
            console.log("There's an obstruction thats non penetrable");
            return true;
        }
        else {
            console.log("There's no obstruction");
            return false;
        }
    };
};

/*
    using the module
    import checkObstruction from "./check_route.js";
    const
*/
export default CheckObstruction
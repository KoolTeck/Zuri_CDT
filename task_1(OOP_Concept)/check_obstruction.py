# Using python as the languauge for the solution
''' 
    This module  helps explorers in calculating the best way to avoid hitting impenetrable rocks under the earth while digging to the core of the earth.

    It contains a single class checkObstruction
'''
#importing the pre-developed module called TimeDuration and other needed modules
from TimeDuration import TimeDuration
from math import sqrt

class checkObstruction:
    """
        Calculates whether there's an obstruction or not from a given location A and B
        Params: 
            point_a(array): the first point co-ordinates
            point_b(array): the second point co-ordinates
            speed(int): the speed of the machine in miles/secs

        Returns: true or false
    """
    def __init__(self, point_a= [0, 0], point_b= [0, 0], speed = 0):
        self.point_a = point_a
        self.point_b = point_b
        self.speed = speed
        
    #get the time duration from A - B from the imported module
    timeFromAtoB = TimeDuration(checkObstruction.point_a, checkObstruction.poin_b) #mins.
    
    @property
    def point_a(self):
        """ returns the point_a co-ordinates """
        return self.point_a
    
    @point_a.setter
    def point_a(self, value):
        """ sets a new value for point_a location """
        self.point_a = value
    
    @property
    def point_b(self):
        """ returns the point_b co-ordinates """
        return self.point_b
    
    @point_b.setter
    def point_b(self, value):
        """ sets a new value for point_b location """
        self.__point_b = value

    def get_distance(self):
        """
           calculates the distance btw. the points
        
        distance btw. two points is given by sqrt((x1 - x2) + (y1 - y2)) where x and y are the horizontal and vertical cordinates of the points
        """
        x1 = self.point_a[0]
        x2 = self.point_b[0]
        y1 = self.point_a[1]
        y2 = self.point_a[2]
        distance = sqrt((x1 - x2) + (y1 - y2)) #miles
        return distance

    @property
    def speed(self):
        # returns the speed of the machine
        return self.speed

    @speed.setter
    def speed(self, value):
        """ sets the speed """
        self.__speed = value
    
    #calculating the expected time from A - B
    expectedTime = speed() * get_distance() #mins.
    if (timeFromAtoB - expectedTime) >= 60:
        print("route has obstruction and impenetrable.")
        return true
    else:
        print("route has no obstruction.")
        return false

# using the class
if __name__ = "__main__":
    check_route = check_obstruction([53.5872,-2.4138], [53.323,-2.2122], 12.1)
    print(check_route)
    # using the setters and getters method
    check_route.point_a = [603.22, -300.55]
    check_route.point_a = [425.24, -422.55]
    check_route.speed = 15.5
    print(check_route)
    


# Using python as the languauge for the solution
''' 
    This module  helps explorers in calculating the best way to avoid hitting impenetrable 
    rocks under the earth while digging to the core of the earth.

    It contains a single class checkObstruction
'''
#importing the pre-developed module called TimeDuration and other needed modules
from time_duration import TimeDuration
from math import sqrt

class Check_obstruction:
    """
        Calculates whether there's an obstruction or not from a given location A and B
        Params: 
            point_a(array): the first point co-ordinates
            point_b(array): the second point co-ordinates
            speed(int): the speed of the machine in miles/secs

        Returns: true or false
    """
    def __init__(self, point_a = [0, 0], point_b = [0, 0], speed = 0):
        self.point_a = point_a
        self.point_b = point_b
        self.speed = speed
    
    @property
    def point_a(self):
        """ returns the point_a co-ordinates """
        return self.__point_a
    
    @point_a.setter
    def point_a(self, value):
        """ sets a new value for point_a location """
        self.__point_a = value
    
    @property
    def point_b(self):
        """ returns the point_b co-ordinates """
        return self.__point_b
    
    @point_b.setter
    def point_b(self, value):
        """ sets a new value for point_b location """
        self.__point_b = value

    @property
    def speed(self):
        # returns the speed of the machine
        return self.__speed

    @speed.setter
    def speed(self, value):
        """ sets the speed """
        self.__speed = value
        
    def get_distance(self):
        """
           calculates the distance btw. the points
        
        distance btw. two points is given by sqrt((x1 - x2) + (y1 - y2)) where x and y are 
        the horizontal and vertical cordinates of the points
        """
        x1 = self.point_a[0]
        x2 = self.point_b[0]
        y1 = self.point_a[1]
        y2 = self.point_a[1]
        distance = sqrt((x1 - x2) + (y1 - y2)) #miles
        return distance
    
    def check_route(self):
        #calculating the expected time from A - B
        #get the time duration from A - B from the imported module
        timeFromAtoB = TimeDuration(self.point_a, self.point_b).duration() #mins.
        expectedTime = self.speed * int(self.get_distance()) #mins.
        if (timeFromAtoB - expectedTime) >= 60:
            print("route has obstruction and impenetrable.")
            return True
        else:
            print("route has no obstruction.")
            return False

# using the class
if __name__ == "__main__":
    route1 = Check_obstruction([53.5872,-2.4138], [53.323,-2.2122], 12.1)
    print(route1.check_route())
    # using the setters and getters method
    route2 = Check_obstruction()
    route2.point_a = [63.22, 30.55]
    route2.point_b = [25.24, -22.55]
    route2.speed = 15.5
    print("--------------------------------------------------------------")
    print(route2.__dict__)
    print(route2.check_route())
    


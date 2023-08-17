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

        Returns: true or false
    """
    def __init__(self, point_a= [0, 0], point_b= [0, 0]):
        self.point_a = point_a
        self.point_b = point_b
        # getting the time duration from A - B from the imported module
        timeFromAtoB = TimeDuration(self.point_a, self.point_b)
        # calculating the distance btw. the points
        # distance btw. two points is given by sqrt((x1 - x2 + y1 - y2)) where x and y are the horizontal and vertical cordinates of the points

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
        """ sets a new value for point_a location """
        self.__point_b = value


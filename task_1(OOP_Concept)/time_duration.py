"""
    A dummy implementation of the timeduration module
"""
class TimeDuration:
    def __init__(self, point_a, point_b):
        self.point_a = point_a
        self.point_b = point_b
    
    def duration(self):
        return 75
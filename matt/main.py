from naive_bayes import naive_bayes
from sklearn import datasets
import numpy as np
irisDataset = datasets.load_iris()
nb = naive_bayes()
nb.train(irisDataset)
newData = [5.8, 2.7, 3.9, 1.2] # should be 1

nb.predict(np.array(newData).reshape((1, -1)))



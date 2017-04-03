from sklearn import datasets
from sklearn import metrics
from sklearn.naive_bayes import GaussianNB
class naive_bayes:
    def __init__(self):
        print 'hello this is the constructor'
    def train(self):
        print 'train'
        # load the iris datasets
        dataset = datasets.load_iris()
        # fit a Naive Bayes model to the data
        model = GaussianNB()
        model.fit(dataset.data, dataset.target)
        print(model)
        # make predictions
        expected = dataset.target
        predicted = model.predict(dataset.data)
        # summarize the fit of the model
        print(metrics.classification_report(expected, predicted))
        # print(metrics.confusion_matrix(expected, predicted))
    def predict(self):
        print 'predict'

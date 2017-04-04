from sklearn.naive_bayes import GaussianNB
class naive_bayes:
    def __init__(self):
        self.model = GaussianNB()
    def train(self, dataset):

        self.data = dataset.data
        self.output = dataset.target
        self.model.fit(self.data, self.output)
    def predict(self, newData):

        predicted = self.model.predict(newData)
        # summarize the fit of the model
        print(predicted)

const Request = require("../models/request");

exports.createRequest = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const request = new Request({
    transactionId: req.body.transactionId,
    customer: req.body.customer,
    creator: req.userData.userId,
    follower: req.body.follower
  });
  request
    .save()
    .then(createdRequest => {
      console.log(createdRequest);
      res.status(201).json({
        message: "Request added successfully",
        request: {
          ...createdRequest,
          id: createdRequest._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a request failed!"
      });
    });
};

exports.updateRequest = (req, res, next) => {
  const request = new Request({
    _id: req.body.id,
    transactionId: req.body.transactionId,
    customer: req.body.customer,
    creator: req.userData.userId
  });
  Request.updateOne({ _id: req.params.id, creator: req.userData.userId }, request)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate request!"
      });
    });
};

exports.getRequests = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const requestQuery = Request.find();
  let fetchedRequests;
  if (pageSize && currentPage) {
    requestQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  requestQuery
    .then(documents => {
      fetchedRequests = documents;
      return Request.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Requests fetched successfully!",
        requests: fetchedRequests,
        maxRequests: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching requests failed!"
      });
    });
};

exports.getRequest = (req, res, next) => {
  Request.findById(req.params.id)
    .then(request => {
      if (request) {
        res.status(200).json(request);
      } else {
        res.status(404).json({ message: "Request not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching request failed!"
      });
    });
};

exports.deleteRequest = (req, res, next) => {
  Request.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting requests failed!"
      });
    });
};

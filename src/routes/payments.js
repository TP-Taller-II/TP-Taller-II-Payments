'use strict';

const express = require('express');
const payments = require('../handlers/payments');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const router = express.Router();

router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan('dev'));

router.get('/getContract', payments.getContract);
router.get('/getTierPrices', payments.getTierPrices);
router.post('/paySubscription', payments.paySubscription);
router.get('/getSubscription/:id', payments.getSubscription);
router.post('/deleteSubscription', payments.deleteSubscription);
router.post('/courseSubscription', payments.courseSubscription);
router.post('/createCourse', payments.createCourse);
router.post('/deleteCourse', payments.deleteCourse);
router.get('/getCourse/:id', payments.getCourse);
router.post('/refund', payments.refund);

module.exports = router;

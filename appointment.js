const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authenticateToken } = require('../middleware/auth');

// Create a new appointment
router.post('/', authenticateToken, async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            userId: req.user.userId
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
});

// Get all appointments for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.userId })
            .populate('doctorId', 'name specialization')
            .populate('hospitalId', 'name address');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

// Get a specific appointment
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            userId: req.user.userId
        })
        .populate('doctorId', 'name specialization')
        .populate('hospitalId', 'name address');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment', error: error.message });
    }
});

// Update an appointment
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        )
        .populate('doctorId', 'name specialization')
        .populate('hospitalId', 'name address');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
});

// Cancel an appointment
router.put('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: { status: 'cancelled' } },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
});

// Reschedule an appointment
router.put('/:id/reschedule', authenticateToken, async (req, res) => {
    try {
        const { date, time } = req.body;
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { 
                $set: { 
                    date,
                    time,
                    status: 'rescheduled'
                }
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
    }
});

module.exports = router; 
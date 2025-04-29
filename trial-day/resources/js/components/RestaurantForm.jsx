import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        opening_hours: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await axios.post('/api/restaurants', formData);
            navigate('/');
        } catch (error) {
            console.error('Error adding restaurant:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2">
                <div className="card">
                    <div className="card-header">
                        <h4>Add New Restaurant</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Restaurant Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="opening_hours" className="form-label">Opening Hours</label>
                                <textarea
                                    className={`form-control ${errors.opening_hours ? 'is-invalid' : ''}`}
                                    id="opening_hours"
                                    name="opening_hours"
                                    value={formData.opening_hours}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="e.g. Mon-Fri 9am-5pm, Sat-Sun 10am-3pm"
                                    required
                                ></textarea>
                                {errors.opening_hours && <div className="invalid-feedback">{errors.opening_hours}</div>}
                                <small className="form-text text-muted">
                                    Enter the opening hours in a format like: Mon-Fri 9am-5pm, Sat-Sun 10am-3pm
                                </small>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Restaurant'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantForm; 
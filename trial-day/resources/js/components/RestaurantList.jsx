import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        day: '',
        time: ''
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/restaurants', { params });
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchRestaurants(filters);
    };

    const resetFilters = () => {
        setFilters({ name: '', day: '', time: '' });
        fetchRestaurants();
    };

    return (
        <div className="row">
            <div className="col-md-12 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h4>Filter Restaurants</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={applyFilters}>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="name" className="form-label">Restaurant Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        placeholder="Search by name"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="day" className="form-label">Day</label>
                                    <select
                                        className="form-select"
                                        id="day"
                                        name="day"
                                        value={filters.day}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Select day</option>
                                        <option value="Mon">Monday</option>
                                        <option value="Tue">Tuesday</option>
                                        <option value="Wed">Wednesday</option>
                                        <option value="Thu">Thursday</option>
                                        <option value="Fri">Friday</option>
                                        <option value="Sat">Saturday</option>
                                        <option value="Sun">Sunday</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="time" className="form-label">Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="time"
                                        name="time"
                                        value={filters.time}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                            <div className="d-flex">
                                <button type="submit" className="btn btn-primary me-2">Apply Filters</button>
                                <button type="button" className="btn btn-secondary" onClick={resetFilters}>Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <h4>Restaurants</h4>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p>Loading restaurants...</p>
                        ) : restaurants.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Opening Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {restaurants.map(restaurant => (
                                            <tr key={restaurant.id}>
                                                <td>{restaurant.name}</td>
                                                <td>{restaurant.opening_hours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No restaurants found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantList; 
import { useState, useEffect } from 'react';
import { bandsService } from '../services/bandsService';

export const useBands = () => {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBands = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bandsService.getMyBands(startDate, endDate);
      setBands(data);
    } catch (err) {
      console.error('Error fetching bands:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBand = async (bandData) => {
    try {
      const newBand = await bandsService.createBand(bandData);
      setBands(prev => [...prev, newBand]);
      return newBand;
    } catch (err) {
      console.error('Error creating band:', err);
      throw err;
    }
  };

  const updateBand = async (id, bandData) => {
    try {
      const updatedBand = await bandsService.updateBand(id, bandData);
      setBands(prev => prev.map(b => b.id === id ? updatedBand : b));
      return updatedBand;
    } catch (err) {
      console.error('Error updating band:', err);
      throw err;
    }
  };

  const deleteBand = async (id) => {
    try {
      await bandsService.deleteBand(id);
      setBands(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting band:', err);
      throw err;
    }
  };

  const changeBandStatus = async (id, status) => {
    try {
      const updatedBand = await bandsService.changeBandStatus(id, status);
      setBands(prev => prev.map(b => b.id === id ? updatedBand : b));
      return updatedBand;
    } catch (err) {
      console.error('Error changing band status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBands();
  }, []);

  return {
    bands,
    loading,
    error,
    fetchBands,
    createBand,
    updateBand,
    deleteBand,
    changeBandStatus,
    refreshBands: fetchBands,
  };
};
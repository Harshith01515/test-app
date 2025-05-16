import React, { useState, useEffect } from 'react';
import TestCaseModal from '../components/TestCaseModal'; 
import './LandingPage.css';

export default function LandingPage() {
  const [test, setTest] = useState({
    name: '',
    companyName: '',
    duration: '',
    startTime: '12:24',
    endTime:   '12:24',
    questions: [
      { id: 1, title: '', description: '', constraints: '', testCases: [] }
    ]
  });
  const [userName, setUserName]         = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeQId, setActiveQId]       = useState(null);

  // Extract prefix of email
  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    setUserName(email.split('@')[0]);
  }, []);

  // Recalculate endTime
  useEffect(() => {
    const [h, m] = test.startTime.split(':').map(Number);
    const dur    = parseInt(test.duration, 10);
    if (isNaN(h) || isNaN(m) || isNaN(dur)) return;
    let total    = h * 60 + m + dur;
    total       %= 1440;
    const nh     = String(Math.floor(total/60)).padStart(2,'0');
    const nm     = String(total % 60).padStart(2,'0');
    setTest(t => ({ ...t, endTime: `${nh}:${nm}` }));
  }, [test.startTime, test.duration]);

  const handleChange   = e => {
    const { name, value } = e.target;
    setTest(t => ({ ...t, [name]: value }));
  };
  const handleQChange  = (e, id) => {
    const { name, value } = e.target;
    setTest(t => ({
      ...t,
      questions: t.questions.map(q =>
        q.id === id ? { ...q, [name]: value } : q
      )
    }));
  };
  const addQuestion    = () =>
    setTest(t => ({
      ...t,
      questions: [
        ...t.questions,
        { id: t.questions.length + 1, title: '', description: '', constraints: '', testCases: [] }
      ]
    }));
  const openModal      = id => {
    setActiveQId(id);
    setModalVisible(true);
  };
  const saveCases      = rows => {
    setTest(t => ({
      ...t,
      questions: t.questions.map(q =>
        q.id === activeQId ? { ...q, testCases: rows } : q
      )
    }));
    setModalVisible(false);
  };
  const deleteQuestion = id =>
    setTest(t => ({
      ...t,
      questions: t.questions.filter(q => q.id !== id)
    }));

  const canSubmit =
    test.name.trim() &&
    test.companyName.trim() &&
    test.duration.trim() &&
    test.questions.every(q => q.title.trim() && q.description.trim());

  const handleSubmit = () => console.log('Submitting test', test);

  return (
    <div className="page-wrapper">
      <h1>Welcome, {userName || 'User'}</h1>

      <div className="test-card">
        <h2>Create Test</h2>

        <label>
          Test Name<span className="required">*</span>
          <input name="name" value={test.name} onChange={handleChange} required />
        </label>

        <label>
          Company Name<span className="required">*</span>
          <input name="companyName" value={test.companyName} onChange={handleChange} required />
        </label>

        <label>
          Duration (min)<span className="required">*</span>
          <input
            type="number"
            name="duration"
            placeholder="Enter only in minutes"
            value={test.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </label>

        <div className="time-grid">
          <label>
            Start Time<span className="required">*</span>
            <input
              type="time"
              name="startTime"
              value={test.startTime}
              onChange={handleChange}
              step="60"
              required
            />
          </label>

          <label>
            End Time
            <input type="time" name="endTime" value={test.endTime} readOnly />
          </label>
        </div>
      </div>

      {test.questions.map(q => (
        <div key={q.id} className="question-card">
          <h3>Question No: {q.id}</h3>

          <label>
            Question Title<span className="required">*</span>
            <input
              name="title"
              value={q.title}
              onChange={e => handleQChange(e, q.id)}
              required
            />
          </label>

          <label>
            Description<span className="required">*</span>
            <textarea
              name="description"
              rows="3"
              value={q.description}
              onChange={e => handleQChange(e, q.id)}
              required
            />
          </label>

          <label>
            Constraints
            <textarea
              name="constraints"
              rows="3"
              value={q.constraints}
              onChange={e => handleQChange(e, q.id)}
            />
          </label>

          <div className="btn-row">
            <button className="blue" onClick={() => openModal(q.id)}>
              + ADD TEST CASES
            </button>
            <button className="red" onClick={() => deleteQuestion(q.id)}>
              DELETE
            </button>
          </div>
        </div>
      ))}

      <div className="btn-row">
        <button className="blue" onClick={addQuestion}>
          ADD QUESTION
        </button>
        <button className="green" onClick={handleSubmit} disabled={!canSubmit}>
          SUBMIT
        </button>
      </div>

      <TestCaseModal
        visible={modalVisible}
        initialCases={test.questions.find(q => q.id === activeQId)?.testCases || []}
        onSave={saveCases}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // App data state
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activities, setActivities] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  // Form states
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [fitnessGoal, setFitnessGoal] = useState('Maintain Weight');

  const [actType, setActType] = useState('Running');
  const [actDuration, setActDuration] = useState('');
  const [actCalories, setActCalories] = useState('');
  const [actSteps, setActSteps] = useState('');

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');

  // Request Headers
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/user/profile', {
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        activityLevel,
        fitnessGoal
      }, authHeader);
      setProfile(res.data);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/user/profile', authHeader);
      setProfile(res.data);
    } catch (err) {
      alert('Failed to load profile');
    }
  };

  const fetchAI = async () => {
    try {
      const res = await axios.get('/api/ai/recommendations', authHeader);
      setRecommendations(res.data);
    } catch (err) {
      alert('Failed to load AI recommendations');
    }
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/activity', {
        activityType: actType,
        duration: Number(actDuration),
        caloriesBurned: Number(actCalories),
        steps: Number(actSteps)
      }, authHeader);
      setActivities([res.data, ...activities]);
      setActDuration('');
      setActCalories('');
      setActSteps('');
    } catch (err) {
      alert('Failed to log activity');
    }
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/workout', {
        title: workoutTitle,
        exercises: [{ name: exName, sets: Number(exSets), reps: Number(exReps), weight: Number(exWeight) }]
      }, authHeader);
      setWorkouts([res.data, ...workouts]);
      setWorkoutTitle('');
      setExName('');
      setExSets('');
      setExReps('');
      setExWeight('');
    } catch (err) {
      alert('Failed to log workout');
    }
  };

  return (
    <div className="app-viewport">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <h2>AI FitTrack</h2>
        </div>
        {token && (
          <div className="nav-actions">
            <button className="btn btn-outline" onClick={fetchProfile}>Load Profile</button>
            <button className="btn btn-emerald" onClick={fetchAI}>Get AI Plan</button>
            <button className="btn btn-danger" onClick={() => { localStorage.clear(); setToken(''); }}>Logout</button>
          </div>
        )}
      </nav>

      <main className="main-container">
        {!token ? (
          /* Authentication Card */
          <div className="auth-wrapper">
            <div className="card auth-card">
              <div className="card-header">
                <h2>Welcome Back</h2>
                <p>Create an account to access your AI fitness insights</p>
              </div>
              <form onSubmit={handleRegister} className="form-stack">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Start Fitness Journey</button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Dashboard Layout */
          <div className="dashboard-grid">

            {/* User Profile & Metrics Summary */}
            <div className="card card-wide">
              <div className="card-header flex-between">
                <div>
                  <h3>👤 Physical Profile & Health Stats</h3>
                  <p>Update your biometrics to recalibrate your health targets</p>
                </div>
                {profile && <span className="status-badge">Logged In</span>}
              </div>

              {profile && (
                <div className="metrics-row">
                  <div className="metric-box">
                    <span className="metric-label">BMI</span>
                    <span className="metric-value">{profile.bmi || '0.0'}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Daily Target</span>
                    <span className="metric-value">{profile.dailyCalories || 0} <small>kcal</small></span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Account</span>
                    <span className="metric-value text-small">{profile.email}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="grid-form">
                <input className="form-input" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <input className="form-input" type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required />
                <input className="form-input" type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                
                <select className="form-input" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                </select>

                <select className="form-input" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                </select>

                <button type="submit" className="btn btn-primary grid-span-full">Recalculate Biometrics & BMI</button>
              </form>
            </div>

            {/* AI Recommendation Engine Result */}
            {recommendations && (
              <div className="card card-ai card-wide">
                <div className="card-header">
                  <h3>🤖 AI Fitness & Nutrition Advice</h3>
                  <p>Generated strategy for: <strong>{recommendations.userGoal}</strong></p>
                </div>
                <div className="ai-content-grid">
                  <div className="ai-box">
                    <h4>🏋️ Training Protocol</h4>
                    <p>{recommendations.recommendations.workoutPlan}</p>
                  </div>
                  <div className="ai-box">
                    <h4>🥗 Nutrition Strategy</h4>
                    <p>{recommendations.recommendations.nutritionStrategy}</p>
                  </div>
                  <div className="ai-box">
                    <h4>💧 Hydration Goal</h4>
                    <p><strong>{recommendations.recommendations.dailyWaterTargetLiters} Liters</strong> per day</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Logging Card */}
            <div className="card">
              <div className="card-header">
                <h3>🏃‍♂️ Log Daily Activity</h3>
              </div>
              <form onSubmit={handleLogActivity} className="form-stack">
                <input className="form-input" type="text" placeholder="Activity (e.g. Running)" value={actType} onChange={(e) => setActType(e.target.value)} required />
                <input className="form-input" type="number" placeholder="Duration (minutes)" value={actDuration} onChange={(e) => setActDuration(e.target.value)} required />
                <input className="form-input" type="number" placeholder="Calories Burned (kcal)" value={actCalories} onChange={(e) => setActCalories(e.target.value)} required />
                <input className="form-input" type="number" placeholder="Steps" value={actSteps} onChange={(e) => setActSteps(e.target.value)} required />
                <button type="submit" className="btn btn-primary">Save Activity Session</button>
              </form>

              {activities.length > 0 && (
                <div className="data-feed">
                  <h4>Recent Logged Sessions</h4>
                  <ul>
                    {activities.map((a, idx) => (
                      <li key={idx} className="data-item">
                        <span><strong>{a.activityType}</strong> ({a.duration} mins)</span>
                        <span className="badge">{a.caloriesBurned} kcal</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Resistance Workout Card */}
            <div className="card">
              <div className="card-header">
                <h3>🏋️ Log Resistance Workout</h3>
              </div>
              <form onSubmit={handleLogWorkout} className="form-stack">
                <input className="form-input" type="text" placeholder="Session Title (e.g., Push Day)" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} required />
                <input className="form-input" type="text" placeholder="Exercise Name (e.g., Bench Press)" value={exName} onChange={(e) => setExName(e.target.value)} required />
                <div className="input-row-3">
                  <input className="form-input" type="number" placeholder="Sets" value={exSets} onChange={(e) => setExSets(e.target.value)} required />
                  <input className="form-input" type="number" placeholder="Reps" value={exReps} onChange={(e) => setExReps(e.target.value)} required />
                  <input className="form-input" type="number" placeholder="kg" value={exWeight} onChange={(e) => setExWeight(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Save Exercise Record</button>
              </form>

              {workouts.length > 0 && (
                <div className="data-feed">
                  <h4>Recent Workouts</h4>
                  <ul>
                    {workouts.map((w, idx) => (
                      <li key={idx} className="data-item">
                        <div>
                          <strong>{w.title}</strong>
                          <p className="text-small">{w.exercises?.map(e => `${e.name} — ${e.sets}×${e.reps} @ ${e.weight}kg`).join(', ')}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
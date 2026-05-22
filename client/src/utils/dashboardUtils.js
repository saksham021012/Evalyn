export const calculateDashboardStats = (interviews) => {
    if (!interviews || interviews.length === 0) {
        return {
            overallProficiency: 0,
            proficiencyChange: 0,
            avgTechScore: 0,
            topSkill: 'N/A',
            totalSessions: 0
        };
    }

    const completedInterviews = [...interviews]
        .filter(i => i.status === 'completed')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const totalSessions = interviews.length;

    if (completedInterviews.length === 0) {
        return {
            overallProficiency: 0,
            proficiencyChange: 0,
            avgTechScore: 0,
            topSkill: 'N/A',
            totalSessions
        };
    }

    // Average Score
    const allScores = completedInterviews.map(i => i.overallEvaluation?.percentage || 0);
    const totalPercentage = allScores.reduce((acc, curr) => acc + curr, 0);
    const avgScore = Math.round(totalPercentage / completedInterviews.length);

    // Proficiency Change
    let pChange = 0;
    if (completedInterviews.length > 1) {
        const lastScore = allScores[allScores.length - 1];
        const prevScores = allScores.slice(0, -1);
        const prevAvg = prevScores.reduce((a, b) => a + b, 0) / prevScores.length;
        pChange = Number((lastScore - prevAvg).toFixed(1));
    }

    // Top Skill
    const skillScores = {};
    completedInterviews.forEach(interview => {
        const performances = interview.overallEvaluation?.skillPerformance || [];
        performances.forEach(p => {
            if (!skillScores[p.skill]) {
                skillScores[p.skill] = { total: 0, count: 0 };
            }
            skillScores[p.skill].total += p.averageScore;
            skillScores[p.skill].count += 1;
        });
    });

    const top = Object.entries(skillScores)
        .map(([skill, data]) => ({ skill, avg: data.total / data.count }))
        .sort((a, b) => b.avg - a.avg)[0];

    return {
        overallProficiency: avgScore,
        proficiencyChange: pChange,
        avgTechScore: avgScore,
        topSkill: top ? top.skill : 'N/A',
        totalSessions
    };
};

export const formatRecentActivity = (interviews, user) => {
    if (!interviews || !user) return [];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return interviews.slice(0, 5).map(i => ({
        id: i._id,
        candidate: user.name,
        avatar: getInitials(user.name),
        date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        stack: [i.role],
        score: Math.round(i.overallEvaluation?.percentage || 0),
        status: i.status.toUpperCase()
    }));
};

export const getResumeActivityStatus = (interviews, user) => {
    if (!user) return {
        name: 'User',
        role: 'Interview Candidate',
        phase: 'Ready to start',
        lastUpload: null
    };

    const mostRecent = interviews?.[0];
    const inProgress = interviews?.find(i => i.status === 'in-progress');

    return {
        name: user.name,
        role: mostRecent?.role || 'Fullstack Developer',
        status: inProgress ? 'in-progress' : 'idle',
        phase: inProgress ? 'middle of an active session' : 'ready for a new session',
        lastUpload: 'Synced',
        sessionId: inProgress?._id || null
    };
};

function RoleSelector({ targetRole, setTargetRole }) {
    const roles = [
        { value: 'Frontend Developer', label: 'Frontend Developer' },
        { value: 'Backend Developer', label: 'Backend Developer' },
        { value: 'Full Stack Developer', label: 'Full Stack Developer' },
        { value: 'DevOps Engineer', label: 'DevOps Engineer' }
    ];

    return (
        <div className="mb-8">
            <label className="block text-gray-400 text-xs font-medium mb-3">
                TARGET ROLE
            </label>
            <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            >
                <option value="">Select your target technical role...</option>
                {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                        {role.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default RoleSelector;

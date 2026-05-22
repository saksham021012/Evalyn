function RoleSelector({ targetRole, setTargetRole }) {
    const roles = [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Full Stack Developer' },
        { value: 'devops', label: 'DevOps Engineer' }
    ];

    return (
        <div className="mb-8">
            <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3 font-semibold">
                TARGET ROLE
            </label>
            <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-white border border-[#e7e5e0] rounded-xl px-4 py-3 text-[#1c1917] focus:outline-none focus:border-[#2b4c3f] transition shadow-sm appearance-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a8a29e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                }}
            >
                <option value="" disabled className="text-[#a8a29e]">Select your target technical role...</option>
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

import { useEffect, useState } from "react";


function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch("http://localhost:8000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading profile...</div>;
    }

    if (!user) {
        return <div className="p-6 text-red-500">Failed to load profile</div>;
    }

    return (<>
        <div className="max-w-3xl mx-auto mt-10 px-6">
           <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">
                    User Profile
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    View and manage your personal details
                </p>
            </div>

            {/* Profile Section */}
            <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">

                {/* Row */}
                <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                    <span className="text-sm text-gray-500">First Name</span>
                    <span className="text-sm font-medium text-gray-900">
                        {user.firstName}
                    </span>
                </div>

                <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                    <span className="text-sm text-gray-500">Last Name</span>
                    <span className="text-sm font-medium text-gray-900">
                        {user.lastName}
                    </span>
                </div>

                <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm font-medium text-gray-900">
                        {user.phone}
                    </span>
                </div>

                <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-900 break-all">
                        {user.email}
                    </span>
                </div>

                {user.role && (
                    <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                        <span className="text-sm text-gray-500">Role</span>
                        <span className="text-sm font-medium text-gray-900">
                            {user.role}
                        </span>
                    </div>
                )}

                {user.address && (
                    <div className="flex justify-between px-5 py-4 hover:bg-gray-50">
                        <span className="text-sm text-gray-500">Location</span>
                        <span className="text-sm font-medium text-gray-900">
                            {user.address.city}, {user.address.country}
                        </span>
                    </div>
                )}

            </div>
        </div>       
    </>
    );

}

export default Profile;
import React from 'react';
import { 
  FolderKanban, 
  Users, 
  CheckCircle, 
  Clock,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '../components/StatsCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 25 },
  { name: 'May', value: 22 },
  { name: 'Jun', value: 30 }
];

const recentProjects = [
  {
    id: '1',
    name: 'Modern Office Complex',
    client: 'TechCorp Inc.',
    status: 'active',
    progress: 75,
    dueDate: '2024-04-15'
  },
  {
    id: '2',
    name: 'Residential Tower',
    client: 'Urban Living Ltd.',
    status: 'pending',
    progress: 30,
    dueDate: '2024-05-20'
  },
  {
    id: '3',
    name: 'Shopping Mall Renovation',
    client: 'RetailSpace Co.',
    status: 'completed',
    progress: 100,
    dueDate: '2024-03-01'
  }
];

const teamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Lead Architect',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    activeProjects: 3
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Senior Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    activeProjects: 2
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    activeProjects: 4
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={24}
          icon={FolderKanban}
          trend={12}
          color="bg-blue-500"
        />
        <StatsCard
          title="Team Members"
          value={15}
          icon={Users}
          trend={8}
          color="bg-green-500"
        />
        <StatsCard
          title="Completed Projects"
          value={18}
          icon={CheckCircle}
          trend={-5}
          color="bg-purple-500"
        />
        <StatsCard
          title="Pending Tasks"
          value={7}
          icon={Clock}
          trend={15}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Project Progress</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#93C5FD" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Due {format(new Date(project.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="text-sm text-blue-500 mt-1">
                  {member.activeProjects} active projects
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
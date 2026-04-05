-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cnic VARCHAR(15) UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create users table for authentication (Simplified mapping)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL, -- Either CNIC for students, or text username for admin
    password VARCHAR(255) NOT NULL, -- In a real app, hash this!
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' | 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert a default admin
INSERT INTO public.users (username, password, role) 
VALUES ('admin@gmail.com', 'admin', 'admin')
ON CONFLICT (username) DO UPDATE SET password = 'admin';

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Open', -- 'Open' | 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(student_id, course_id)
);

-- Create leaves table
CREATE TABLE IF NOT EXISTS public.leaves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

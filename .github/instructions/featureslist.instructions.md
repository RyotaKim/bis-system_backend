---
---
# Features
- Resident Main Page
    - Home (File a request button and Check Request Status Button)
    - File a Request input types:
        - Full Name
        - Contact Number
        ```instructions
        ---
        applyTo: "**"
        ---
        # Features

        - Resident Main Page
            - Home (File a request button and Check Request Status Button)
            - File a Request input types:
                - Full Name
                - Contact Number
                - Address
                - Purpose
                - Educational Attainment (if any)
                - Educational Course (if student)
                - Age
                - Type of Document (Barangay Clearance, Business Permit, Certificate of Indigency, First-time Job Seeker form)
                - ID Upload
            - Check a Request input type:
                - Reference Number
            - About (Barangay staff details)
            - Contact (barangay emails and Facebook page)

        - Admin Login page
            - Admin user authentication

        - Admin Dashboard
            - Total amounts of Requests, Complaints, Pending Requests, and Resolved Complaints

        - Admin Request Management Page
            - Filed requests with auto-incremented reference number, resident name, request type, date of submission, status, and actions (view uploaded ID, view full details including purpose, edit status, option to delete after release)

        - Admin Complaint Management Page
            - Encode a Complaint (admin only)
                - Inputs: Complainant Name, Complaint Type, Description
                - Upon submitting, must auto-increment a reference number and set status to "pending"
            - View complaints (reference number, resident name, complaint type, date, actions: view description, edit status, delete resolved complaint)

        - Admin Report and Analytics Page
            - Charts of weekly request rates by document type and complaint resolution rate
            - Descriptive information about the charts

        ---

        This document summarizes the feature set for the BIS System frontend and admin pages. Use it as a checklist when building UI screens or wiring API endpoints.

        ```


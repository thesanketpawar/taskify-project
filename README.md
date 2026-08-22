<img width="1912" height="948" alt="image" src="https://github.com/user-attachments/assets/84f15537-55b3-4378-9fc0-b0f696260f7f" />


# 🚀 Taskify - End-to-End Microservices Deployment on AWS & Kubernetes

A production-grade microservices task management application deployed on **Kubernetes (K8s)** with an **Nginx Reverse Proxy**, **AWS VPC Infrastructure**, and a standalone **MongoDB EC2 Database**.

---

## 📐 Architecture Overview

The system is built on AWS Infrastructure using a custom VPC network topology. Traffic enters through an Nginx Reverse Proxy hosted on a public Jumpserver, which routes UI traffic to the React frontend and API traffic to the Express backend deployed inside a Kubernetes cluster.

<img width="584" height="440" alt="image" src="https://github.com/user-attachments/assets/f19cecaa-2655-45cc-80a7-30a14ae33494" />


---

## 🛠️ Infrastructure & Tech Stack

* **Cloud Provider:** AWS (VPC, Subnets, Internet Gateway, NAT Gateway, Security Groups, Elastic IP)
* **Container Orchestration:** Kubernetes (kubeadm, CoreDNS, Flannel CNI)
* **Reverse Proxy:** Nginx (Jumpserver)
* **Database:** MongoDB Community Server (EC2 Private Subnet)
* **Backend:** Node.js, Express, Mongoose
* **Frontend:** React, Vite, Axios
* **Containers:** Docker, DockerHub

---

## 📁 Repository Structure

.
├── k8s-manifests/
│   ├── namespace.yml          # Creates 'taskify' namespace
│   ├── configmap.yml          # Contains MONGO_URI and PORT env vars
│   ├── secrets.yml            # Encrypted sensitive credentials
│   ├── frontend-deployment.yml# React Frontend Deployment & NodePort Service (31365)
│   ├── backend-deployment.yml # Node.js Backend Deployment & NodePort Service (30005)
│   └── mongodb-service.yml    # External ClusterIP Service & Manual Endpoints (10.0.3.144)
└── README.md


⚙️ Step-by-Step Installation & Deployment
1. MongoDB Configuration (Database Instance: 10.0.3.144)
Update /etc/mongod.conf on the MongoDB EC2 instance to listen on all interfaces:

Bash
sudo nano /etc/mongod.conf
Set the bind address:

YAML
net:
  port: 27017
  bindIp: 0.0.0.0
Restart MongoDB and ensure AWS Security Group allows inbound TCP traffic on port 27017 from 10.0.0.0/16:

Bash
sudo systemctl restart mongod
2. Kubernetes Deployment (k8s-master)
Clone the repository and apply the manifests in sequence:

Bash
# 1. Create Namespace
kubectl apply -f k8s-manifests/namespace.yml

# 2. Apply ConfigMap and Secrets
kubectl apply -f k8s-manifests/configmap.yml -n taskify
kubectl apply -f k8s-manifests/secrets.yml -n taskify

# 3. Apply Database Service & Endpoints
kubectl apply -f k8s-manifests/mongodb-service.yml -n taskify

# 4. Deploy Application Workloads
kubectl apply -f k8s-manifests/backend-deployment.yml -n taskify
kubectl apply -f k8s-manifests/frontend-deployment.yml -n taskify
Verify that all resources are active:

Bash
kubectl get pods,svc,endpoints -n taskify
3. Reverse Proxy Configuration (Jumpserver)
Configure Nginx on the Jumpserver (/etc/nginx/sites-available/default):

Nginx
server {
    listen 80;
    server_name _;

    # Frontend Route
    location / {
        proxy_pass [http://10.0.2.150:31365](http://10.0.2.150:31365);
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API Route
    location /api {
        proxy_pass [http://10.0.2.150:30005](http://10.0.2.150:30005);
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Validate and reload Nginx:

Bash
sudo nginx -t
sudo systemctl restart nginx

# Test API Endpoint via Nginx
curl -I http://localhost/api/tasks

# Test DB Connection from K8s Master
nc -zv 10.0.3.144 27017

<template>
	<div>
		<base-dialog :show="!!error" title="Error occured" @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog fixed title="Authenticating..." :show="isLoading">
			<base-spinner></base-spinner>
		</base-dialog>
		<base-card>
			<form @submit.prevent="submitForm">
				<div class="form-control">
					<label for="email">E-Mail</label>
					<input type="email" id="email" v-model.trim="email" />
				</div>
				<div class="form-control">
					<label for="password">Password</label>
					<input type="password" id="password" v-model="password" />
				</div>
				<p v-if="!formIsValid">
					Please enter a valid E-mail or password (password at least 6
					characters long)
				</p>
				<div class="form-buttons">
					<base-button> {{ submitButtonCaption }} </base-button>
					<base-button type="button" mode="flat" @click="switchAuthMode">
						{{ switchModeButtonCaption }}
					</base-button>
				</div>
			</form>
		</base-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
			formIsValid: true,
			mode: 'login',
			isLoading: false,
			error: null,
		};
	},
	computed: {
		submitButtonCaption() {
			if (this.mode === 'login') {
				return 'Login';
			} else {
				return 'Signup';
			}
		},
		switchModeButtonCaption() {
			if (this.mode === 'login') {
				return 'Signup Instead';
			} else {
				return 'Login Instead';
			}
		},
	},
	methods: {
		async submitForm() {
			this.formIsValid = true;
			if (
				this.email === '' ||
				!this.email.includes('@') ||
				this.password.length < 6
			) {
				this.formIsValid = false;
				return;
			}
			this.isLoading = true;
			try {
				if (this.mode === 'login') {
					await this.$store.dispatch('login', {
						email: this.email,
						password: this.password,
					});
					const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
					this.$router.replace(redirectUrl);
				} else {
					await this.$store.dispatch('signup', {
						email: this.email,
						password: this.password,
					});
				}
			} catch (err) {
				this.error = err.message || 'Failed to authenticate, try later';
			}
			this.isLoading = false;
		},
		switchAuthMode(e) {
			e.preventDefault();
			if (this.mode === 'login') {
				this.mode = 'signup';
			} else {
				this.mode = 'login';
			}
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>

<style scoped>
form {
	margin: 1rem;
	padding: 1rem;
}

.form-control {
	margin: 0.5rem 0;
}

label {
	font-weight: bold;
	margin-bottom: 0.5rem;
	display: block;
}

input,
textarea {
	display: block;
	width: 100%;
	font: inherit;
	border: 1px solid #ccc;
	padding: 0.15rem;
}

input:focus,
textarea:focus {
	border-color: #3d008d;
	background-color: #faf6ff;
	outline: none;
}
.form-buttons {
	display: flex;
	flex-direction: row;
}
</style>